import { AppDataSource, connectDB } from "../config/configDb.js";
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js"
/**
 
  result = {
    "nombre_tipo_ingrediente": [
      {
        costo: costo_de_evento
        tipo: merma o comanda
      }
    "nombre_tipo_utensilio": [
      {
        costo: costo_de_vento
        tipo: merma 
      }
      "Quizas total ¿?"
    ]
  }
 */
export async function getCostosService(body) {
  const tipo_ingredienteRepositorio = AppDataSource.getRepository(TipoIngrediente)
  const tipo_utensilioRepositorio = AppDataSource.getRepository(TipoUtensilio)
  const { ids_platillo, ids_tu } = body;
  const [comandas, errorComandas] = await ExtraerComandas();
  if (errorComandas) {
    return [null, "Error en extraer comandas"]
  }
  const [pedidos, errorPedidos] = await ExtraerPedido();
  if (errorPedidos) {
    return [null, "Error en extraer Pedidos"]
  }
  //TODO: usar el mismo formato que los otros extraer
  let mermas = await extraerMermas()
  //TODO: Si FIFO ya fue calculado una vez no calcularlo denuevo
  //a menos que se especifique (ej: un boton recalcular)
  //TODO comentar test
  Test_descontarIngredientePedido()
  TestDescontarPedidos()
  let CostoComanda = costoFIFO(comandas, pedidos);
  const [platillos, errorExtraerPlatillos] = await extraerPlatillos(ids_platillo)
  if (errorExtraerPlatillos) {
    console.log(errorExtraerPlatillos)
    return
  }
  const [costo_platillo, errorCostoPlatillo] = calcularCostoPlatillo(platillos, CostoComanda, mermas)
  //const [costos_platillo, errorCostoVentaComanda] = calcularCostoPlatilloEnBaseComanda(platillos, CostoComanda)
  //if (errorCostoVentaComanda) {
    //console.log(errorCostoVentaComanda)
    //return
  //}
  //calcularCostoMermasEnBaseAFiltro(mermas, ids_platillo, ids_tu);
  //TODO: ordenar mermas y comandas para que sean coherentes y por fecha
  //console.log(CostoComanda)

  //Juntar mermas con comandas y ordenarlos por fecha
  let listaCostos = [...CostoComanda, ...mermas];
  listaCostos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  return [listaCostos, null];
}
function calcularCostoMermasEnBaseAFiltro(mermas, ids_ti, ids_tu) {
  //TODO: validateQuery
  for (let i = 0; i < mermas.length; i++) {
    let merma = mermas[i];
    const costo_merma = getCostoMerma(merma, ids_ti, ids_tu);
    merma.costo = costo_merma;
  }
}
function getCostoMerma(merma, ids_ti, ids_tu) {
  let costo_merma = 0;
  const ingredientes = merma.ingredientes;

  if (!ingredientes) {
    return [null, "Error ingrediente"];
  }
  const ingedientesKeys = Object.keys(merma.ingredientes);
  if (ingredientes && ingedientesKeys.length != 0) {
    for (let i = 0; i < ids_ti.length; i++) {
      const id_tipo_ingrediente = ids_ti[i];
      if (ingredientes[id_tipo_ingrediente]) {
        costo_merma += ingredientes[id_tipo_ingrediente].costo_total
      }
    }
  }
  const utensilios = merma.utensilios;
  console.log("utensilios")
  console.log(utensilios)
  if (!utensilios) {
    return [null, "Error utensilio es nulo"]
  }
  const utensilioKeys = Object.keys(merma.utensilios)
  if (utensilioKeys.length != 0) {
    for (let i = 0; i < ids_tu.length; i++) {
      const id_tipo_utensilio = ids_tu[i];
      if (utensilios[id_tipo_utensilio]) {
        costo_merma += utensilios[id_tipo_utensilio].costo_total
      }
    }
  }
  return costo_merma;
}
/*
mermas = {
  id_merma
  fecha_merma
  utensilios: {
  }
}
*/
//Opcion 1 extraer todas las mermas con un diccionario de utensilios
//y al momento de ver la consulta solo tener en cuenta los utensilios seleccionados
//Opcion 2 extraer los tipos de utensilios seleccionados y ver las mermas de ese tipo

/*
mermas = {
  id_merma
  fecha_merma ORDER BY
  ingredientes = {
    nombre_tipo_ingrediente 
    costo_total
  }
  utensilios = {
    id_tipo_utensilio: {
      nombre_tipo_utensilio
      costo_total
    }
    costo_total
  } 
}

*/
async function extraerMermas() {
  //No te sirve tener un mermas total, porque de todos modos lo voy a querer filtrar por tipo de ingredinte y utensilio
  let mermas = await AppDataSource.query(`
  SELECT m.id_merma, m.fecha_merma as fecha
  FROM merma m
  ORDER BY m.fecha_merma ASC
  `)
  for (let i = 0; i < mermas.length; i++) {
    let merma = mermas[i]
    const ingredientes = await AppDataSource.query(`
    SELECT im.cantidad_perdida_ingrediente, i.costo_ingrediente, ci.cantidad_pedida, 
      ti.id_tipo_ingrediente, ti.nombre_tipo_ingrediente
    FROM ingrediente_merma im
    INNER JOIN ingrediente i ON i.id_ingrediente = im.id_ingrediente
    INNER JOIN compuesto_ingrediente ci ON ci.id_ingrediente = i.id_ingrediente
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_tipo_ingrediente
    WHERE im.id_merma = $1
    `, [merma.id_merma])
    merma.ingredientes = {}
    if (ingredientes || ingredientes.length !== 0) {
      //agregar los ingredientes correspondientes a la merma
      agregarIngredientesAMermas(merma, ingredientes);
    }
    const utensilios = await AppDataSource.query(`
    SELECT um.cantidad_perdida_utensilio, u.costo_utensilio, cu.cantidad_pedida, 
      tu.nombre_tipo_utensilio, tu.id_tipo_utensilio
    FROM utensilio u
    INNER JOIN compuesto_utensilio cu ON cu.id_utensilio = u.id_utensilio
    INNER JOIN utensilio_merma um ON um.id_utensilio = u.id_utensilio
    INNER JOIN tipo_utensilio tu ON tu.id_tipo_utensilio = u.id_tipo_utensilio
    WHERE um.id_merma = $1
    `, [merma.id_merma])
    merma.utensilios = {}
    if (utensilios || utensilios.length !== 0) {
      agregarUtensilioAMerma(merma, utensilios)
    }
  }
  return mermas
}
function agregarIngredientesAMermas(merma, ingredientes) {
  for (let ii = 0; ii < ingredientes.length; ii++) {
    const ingrediente = ingredientes[ii];
    console.log("cantidad pedida")
    console.log(ingrediente.cantidad_pedida)
    const costo_unitario_ingrediente = ingrediente.costo_ingrediente / ingrediente.cantidad_pedida;
    if (merma.ingredientes[ingrediente.id_tipo_ingrediente]) { //existe este ingrediente en el diccionario
      merma.ingredientes[ingrediente.id_tipo_ingrediente].costo_total
        += costo_unitario_ingrediente * ingrediente.cantidad_perdida_ingrediente;
    } else {// si no existe
      merma.ingredientes[ingrediente.id_tipo_ingrediente] = {
        nombre_tipo_ingrediente: ingrediente.nombre_tipo_ingrediente,
        costo_total: costo_unitario_ingrediente * ingrediente.cantidad_perdida_ingrediente
      }
    }
  }
}
function agregarUtensilioAMerma(merma, utensilios) {
  for (let ii = 0; ii < utensilios.length; ii++) {
    const utensilio = utensilios[ii];
    let utensilios_merma = merma.utensilios
    console.log("utensilio")
    console.log(utensilio)
    console.log("test")
    console.log(utensilios_merma)
    const costo_unitario_utensilio = utensilio.costo_utensilio / utensilio.cantidad_utensilio
    if (utensilios_merma[utensilio.id_tipo_utensilio]) {//existe el utensilio en el diccionario
      utensilios_merma[utensilio.id_tipo_utensilio].costo_total
        += costo_unitario_utensilio * utensilio.cantidad_perdida_utensilio
    } else {
      utensilios_merma[utensilio.id_tipo_utensilio] = {
        nombre_tipo_utensilio: utensilio.nombre_tipo_utensilio,
        costo_total: costo_unitario_utensilio * utensilio.cantidad_perdida_utensilio
      }
    }
  }
}
/**
 CostoEnComandas {
    id_comanda: 1,
    fecha_compra_comanda: 2024-11-20T03:00:00.000Z,
    hora_compra_comanda: '14:00:00',
    estado_comanda: 'pendiente',
    ingredientes: { zanahoria: {
      costo_total: ,
      costo_unitario:,
      cantidad_ingrediente:, 
    } }
 }
 */
//Modifica el diccionario CostoEnComandas agregando el costo de la comanda
//pero solo de los tipos de ingredientes seleccionados anteriormente
function calcularCostoPlatilloEnBaseComanda(platillos, CostoEnComandas) {
  //TODO: validationQuery
  //TODO: agregar calculo de ventas al costo FIFO
  let listaCostoPlatillo = [];
  let platilloObj = {}
  for (let i = 0; i < platillos.length; i++) {
    const platillo = platillos[i];
    platilloObj.id_platillo = platillo.id_platillo
    platilloObj.nombre_platillo = platillo.nombre_platillo
    platilloObj.eventos = [];
    //Calcular el costo del platillo para cada comanda
    for (let ii = 0; ii < CostoEnComandas.length; ii++) {
      const CostoComanda = CostoEnComandas[ii];
      const ingredientes = CostoComanda.ingredientes;
      const costo_de_comanda = CalcularCostoVentaDeComanda(platillo.ingredientes, ingredientes);
      CostoComanda.costo = costo_de_comanda;
    }
  }
  return [listaCostoPlatillo, null]
}

//TODO: prueba unitaria
function CalcularCostoVentaDeComanda(ingredientes_platillo, ingredientes) {
  //iterar por claves
  let costo_comanda_de_ingredientes_seleccionados = 0;
  for (let i = 0; i < ids_ti.length; i++) {
    const id_tipo_ingrediente = ids_ti[i];
    if (ingredientes[id_tipo_ingrediente]) {
      costo_comanda_de_ingredientes_seleccionados
        += ingredientes[id_tipo_ingrediente].costo_total
    }
  }
  return costo_comanda_de_ingredientes_seleccionados;
}
//Crear comandas para costoFIFO
async function ExtraerComandas() {
  let result = []
  let ingredientes = {}
  //buscar todas las comandas
  const comandas = await AppDataSource.query(`
  SELECT c.id_comanda, c.fecha_compra_comanda, c.hora_compra_comanda, c.estado_comanda
  FROM comanda c 
  `)
  if (!comandas || comandas.lenght === 0) {
    console.log("Error 3")
    return [null, "No hay comandas"];
  }
  //por cada comanda buscar los platillos para ver que ingredientes usa la comanda
  for (let i = 0; i < comandas.length; i++) {
    const comanda = comandas[i];
    //Se agregan los datos de la comanda al diccionario de la comanda
    let comanda_diccionario = {}
    comanda_diccionario["id_comanda"] = comanda.id_comanda
    comanda_diccionario["fecha"] = comanda.fecha_compra_comanda;
    comanda_diccionario["hora_compra_comanda"] = comanda.hora_compra_comanda;
    comanda_diccionario["estado_comanda"] = comanda.estado_comanda;
    const platillos = await AppDataSource.query(`
    SELECT *
    FROM platillo p
    INNER JOIN conforma_comanda cc ON cc.id_platillo = p.id_platillo   
    WHERE cc.id_comanda = $1
    `, [comanda.id_comanda])
    console.log(platillos)
    if (!platillos || platillos.length === 0) {
      console.log("Error 2")
      continue
      //return [null, "No existen platillos para la comanda; Esto deberia ser imposible"];
    }
    for (let ii = 0; ii < platillos.length; ii++) {
      const platillo = platillos[ii];
      //ver que ingredientes usa el platillo para realizar la cuenta.
      //Se hacen en consultas separadas para que no queden multiples fillas del mismo plato
      const ingredientes_platillo = await AppDataSource.query(`
      SELECT *
      FROM compuesto_platillo cp
      INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = cp.id_tipo_ingrediente
      WHERE cp.id_platillo = $1
      `, [platillo.id_platillo])
      if (!ingredientes_platillo || ingredientes_platillo.length === 0) {
        console.log("Error 1")
        return [null, "El platillo no tiene ingredientes; Esto deberia ser imposible"];
      }
      //En base a la informacion anterior se crea agregan elementos a el
      //diccionario de ingredientes tal que ingredientes se vea:
      /* ingredientes = {

        }
      */
      for (let iii = 0; iii < ingredientes_platillo.length; iii++) {
        const tipo_ingrediente = ingredientes_platillo[iii];
        let elemento;
        const costo_platillo =
          tipo_ingrediente.porcion_ingrediente_platillo * platillo.cantidad_platillo
        if (!ingredientes[tipo_ingrediente.id_tipo_ingrediente]) {
          elemento = {};
          elemento["cantidad"] = costo_platillo
          ingredientes[tipo_ingrediente.id_tipo_ingrediente] = elemento;
        } else {
          elemento = ingredientes[tipo_ingrediente.id_tipo_ingrediente]
          elemento["cantidad"] += costo_platillo
        }
      }
    }
    comanda_diccionario["ingredientes"] = ingredientes;
    result.push(comanda_diccionario)
  }
  console.log(result)
  return [result, null];
}

async function ExtraerPedido() {
  let result = []
  const pedidos = await AppDataSource.query(`
  SELECT p.id_pedido, p.fecha_compra_pedido
  FROM pedido p
  `);
  if (!pedidos || pedidos.length === 0) {
    return [null, "No hay pedidos"]
  }
  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    //Aqui se guarda la informacion del pedido que luego se envia
    let pedido_diccionario = {}
    pedido_diccionario["fecha_compra"] = pedido.fecha_compra_pedido
    const ingredientes_de_pedido = await AppDataSource.query(`
    SELECT *
    FROM ingrediente i
    INNER JOIN compuesto_ingrediente cp ON cp.id_ingrediente = i.id_ingrediente
    INNER JOIN pedido p ON p.id_pedido = cp.id_pedido
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_tipo_ingrediente
    WHERE cp.id_pedido = $1
    `, [pedido.id_pedido])
    if (!ingredientes_de_pedido || ingredientes_de_pedido.length === 0) {
      //Seguir con el proximo pedido
      console.log("no")
      continue;
    } else {
      console.log("si")
      console.log(pedido.id_pedido)
    }
    console.log("que tipo tiene id_tipo_ingrediente");
    console.log(ingredientes_de_pedido)
    let ingredientes = {}
    //TODO: para cada pedido ¿solo una tabla de ingredientes por tipo?
    for (let ii = 0; ii < ingredientes_de_pedido.length; ii++) {
      const ingrediente_pedido = ingredientes_de_pedido[ii];
      let ingrediente = {}
      ingrediente["cantidad"] = ingrediente_pedido.cantidad_ingrediente;
      ingrediente["costo_unitario"] = ingrediente_pedido.costo_ingrediente;
      ingrediente["costo_total"] =
        ingrediente_pedido.costo_ingrediente * ingrediente_pedido.cantidad_ingrediente;
      console.log("ingredientes pedido")
      console.log(ingrediente_pedido)
      const id_tipo_ingrediente = ingrediente_pedido["id_tipo_ingrediente"]
      console.log(id_tipo_ingrediente)
      ingredientes[id_tipo_ingrediente] = ingrediente;
      console.log(ingredientes)
    }
    pedido_diccionario["ingredientes"] = ingredientes;
    result.push(pedido_diccionario)
  }
  console.log("pedidos")
  console.log(result)
  return [result, null];
}
//TODO: test unitario
function costoFIFO(comandas, pedidos) {
  let indices = {}
  for (let i = 0; i < comandas.length; i++) {
    const comanda = comandas[i];
    const ingredientes_keys = Object.keys(comanda.ingredientes);
    for (let ii = 0; ii < ingredientes_keys.length; ii++) {
      descontarPedidos(comanda.ingredientes[ingredientes_keys[ii]], ingredientes_keys[ii], indices, pedidos);
    }
  }
  return comandas;
}
/*
  Descuenta el ingrediente teniendo en cuenta los pedidos, a los cuales 
  se accede con un diccionario de indices para evitar una busqueda lineal
  cada vez que miro se revisa una comanda nueva
*/
//TODO: test unitario
function descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos) {
  console.log(ingrediente)
  console.log(id_tipo_ingrediente)
  console.log(indices)
  console.log(pedidos)
  if (!ingrediente.consumido) {
    ingrediente.consumido = 0;
    ingrediente.costo_total = 0;
    ingrediente.costo_unitario = 0;
  }
  //Validacion ingrediente
  if (ingrediente.cantidad < 0) {
    return [null, "La cantidad no puede ser negativa"]
  }
  if (ingrediente.consumido < 0) {
    return [null, "la cantidad consumida no puede ser negativa"]
  }
  if (ingrediente.consumido > ingrediente.cantidad) {
    return [null, "No se puede consumir mas que la cantidad"]
  }
  if (ingrediente.costo_unitario < 0) {
    return [null, "El costo unitario no puede ser menor a 0"]
  }
  if (ingrediente.costo_total < 0) {
    return [null, "El costo total no puede ser menor a 0"]
  }
  //Validacion id_tipo_ingrediente
  if (id_tipo_ingrediente < 0) {
    return [null, "no es una id"]
  }
  if (!indices) {
    return [null, "indices no es un diccionario"]
  }
  //validar Keys
  //validar pedidos
  //Sacar una funcion validar pedido
  if (pedidos.length === 0) {
    return [null, "no hay pedidos"]
  }
  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    if (!pedido.fecha_compra) {
      return [null, "no incluye fecha"]
    }
    if (!pedido.ingredientes || pedido.ingredientes.length === 0) {
      //TODO: que hacer en este caso
      return [null, "pedido no tiene ingredientes"]
    }
    for (let ii = 0; ii < pedido.ingredientes.length; ii++) {
      const ingrediente = pedido.ingredientes[ii];
      if (ingrediente.cantidad < 0) {
        return [null, "cantidad invalida"]
      }
      if (ingrediente.costo_total < 0) {
        return [null, "costo total invalido"]
      }
      if (ingrediente.costo_unitario < 0) {
        return [null, "costo unitario invalido"]
      }
    }
  }
  if (!indices[id_tipo_ingrediente]) {
    indices[id_tipo_ingrediente] = 0
  }
  while (ingrediente.consumido < ingrediente.cantidad) {
    const indice = indices[id_tipo_ingrediente];
    console.log("indice")
    console.log(indice)
    console.log(pedidos.length)
    if (indice >= pedidos.length) {
      return [null, "¿Mas ingredientes consumidos qu pedidos"]
    }
    const pedido = pedidos[indice];
    const ingredientes = pedido["ingredientes"]
    const ingrediente_pedido = ingredientes[id_tipo_ingrediente]
    if (ingrediente_pedido) {
      const [rc, err] = descontarIngredientePedido(ingrediente,
        ingrediente_pedido)
      if (err) {
        console.log(err)
        //TODO: error handle
        return [null, "Error en descontarIngredientePedido"]
      }
      if (rc == 1) {
        indices[id_tipo_ingrediente]++;
        console.log(indices)
      }
    } else {
      //El pedido no tenia ese ingrediente
      indices[id_tipo_ingrediente]++;
    }
  }
  //calcular costo unitario
  ingrediente.costo_unitario = ingrediente.costo_total / ingrediente.cantidad;
}
/*
  Cambia los objetos ingrediente y ingrediente_pedido segun corresponda
  Se descuentan los ingredientes

  retorna 1 si se tiene que cambiar el ingrediente_pedido y 0 si no
*/
function descontarIngredientePedido(ingrediente, ingrediente_pedido) {
  console.log(ingrediente)
  console.log(ingrediente_pedido)
  if (!ingrediente_pedido.consumido) {
    ingrediente_pedido.consumido = 0;
  }
  if (!ingrediente.consumido) {
    ingrediente.consumido = 0;
  }
  //if (!ingrediente_pedido) {
  //return 1;
  //}
  //Validacion Ingrediente
  if (ingrediente.cantidad < 0) {
    return [null, "El ingrediente tiene una cantidad invalida"];
  }
  if (ingrediente.consumido < 0) {
    return [null, "El ingrediente tiene una cantidad consumida no valida"]
  }
  if (ingrediente.consumido > ingrediente.cantidad) {
    return [null, "El ingrediente tiene una cantidad consumida superior a la cantidad"]
  }
  if (ingrediente.costo_unitario < 0) {
    return [null, "El costo unitario no puede ser negativo"]
  }
  if (ingrediente.costo_total < 0) {
    return [null, "El costo total no puede ser negativo"]
  }
  if (ingrediente.costo_total > ingrediente.cantidad * ingrediente.costo_unitario) {
    return [null, "El costo total no puede ser mayor a la cantidad por el costo unitario"]
  }
  // Validacion ingrediente_pedido
  if (ingrediente_pedido.cantidad < 0) {
    return [null, "La cantidad de ingrediente_pedido no puede ser negativa"]
  }
  if (ingrediente_pedido.costo_total < 0) {
    return [null, "El costo total no puede ser negativo"]
  }
  if (ingrediente_pedido.costo_unitario < 0) {
    return [null, "El costo unitario no puede ser negativo"]
  }


  if ((ingrediente_pedido.cantidad - ingrediente_pedido.consumido) < ingrediente.cantidad) {
    ingrediente_pedido.consumido = ingrediente_pedido.cantidad;//Se consume todo
    ingrediente.consumido += ingrediente_pedido.cantidad; //Queda por descontar una cantidad menor
    ingrediente.costo_total += ingrediente_pedido.costo_total //se usa total porque se consume todo
    return [1, null];
  } else {//Caso los ingredientes que quedan en este pedido son mas que los de la comanda
    const cantidad_consumir = ingrediente.cantidad - ingrediente.consumido;
    ingrediente_pedido.consumido += cantidad_consumir; //se consume toda la cantidad
    //no deberia ser += porque se añade a lo anterior en caso de que hayan anteriores TODO:
    ingrediente.consumido = cantidad_consumir;//No queda por descontar
    ingrediente.costo_total += cantidad_consumir * ingrediente_pedido.costo_unitario;
    return [0, null];
  }
}


function Test_descontarIngredientePedido() {
  tablaInvalidezDescontarIngredientePedido()
  console.log("########################")
  console.log("Test de Casos de negocio")
  console.log("########################")
  // Caso el ingrediente de comanda se satisface
  let ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  let ingrediente_pedido = {
    cantidad: 10,
    costo_total: 10,
    costo_unitario: 1
  }
  let [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 1 MAL")
    console.log(error)
  } else {
    if (result === 0) {
      console.log("Test 1 BIEN")
      console.log(result)
      console.log(ingrediente)
      console.log(ingrediente_pedido)

    } else {
      console.log("Test 1 MAL")
      console.log(result)
      console.log("ingredientes: " + ingrediente)
      console.log("ingredientes_pedido: " + ingrediente_pedido)
    }
  }
  ingrediente = {
    cantidad: 20,
    consumido: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  ingrediente_pedido = {
    cantidad: 10,
    costo_total: 10,
    costo_unitario: 1
  }; //; El programa se rompe sin este punto coma
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 2 MAL")
    console.log(error)
  } else {
    if (result === 1) {
      console.log("Test 2 BIEN")
      console.log(result)
      console.log(ingrediente)
      console.log(ingrediente_pedido)

    } else {
      console.log("Test 2 MAL")
      console.log(result)
      console.log("ingrediente: ")
      console.log(ingrediente)
      console.log("ingrediente pedido")
      console.log(ingrediente_pedido)
    }
  }
  ingrediente = {
    cantidad: 5,
    consumido: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  ingrediente_pedido = {
    cantidad: 10,
    costo_total: 10,
    costo_unitario: 1
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 3 MAL")
    console.log(error)
  } else {
    if (result === 1) {
      console.log("Test 3 BIEN")
      console.log(result)
      console.log(ingrediente)
      console.log(ingrediente_pedido)

    } else {
      console.log("Test 3 MAL")
      console.log(result)
      console.log(ingrediente)
      console.log(ingrediente_pedido)
    }
  }

}
function tablaInvalidezDescontarIngredientePedido() {
  //Casos invalidos
  //invalido cantidad de ingrediente
  let ingrediente = {
    cantidad: -1,
    consumido: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  let ingrediente_pedido = {
    cantidad: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  let [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 1 BIEN")
    console.log(error)
  } else {
    console.log("Test 1 MAL")
  }
  //invalido consumido de ingrediente
  ingrediente = {
    cantidad: 10,
    consumido: -1,
    costo_total: 0,
    costo_unitario: 0
  }
  ingrediente_pedido = {
    cantidad: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 2 BIEN")
    console.log(error)
  } else {
    console.log("Test 2 MAL")
  }

  //invalido consumido de ingrediente
  ingrediente = {
    cantidad: 10,
    consumido: 20,
    costo_total: 0,
    costo_unitario: 0
  }
  ingrediente_pedido = {
    cantidad: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 3 BIEN")
    console.log(error)
  } else {
    console.log("Test 3 MAL")
  }

  //invalido costo_total de ingrediente
  ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: -100,
    costo_unitario: 10
  }
  ingrediente_pedido = {
    cantidad: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 4 BIEN")
    console.log(error)
  } else {
    console.log("Test 4 MAL")
  }

  //invalido costo_total de ingrediente
  ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: 200,
    costo_unitario: 10
  }
  ingrediente_pedido = {
    cantidad: 0,
    costo_total: 0,
    costo_unitario: 0
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 5 BIEN")
    console.log(error)
  } else {
    console.log("Test 5 MAL")
  }

  //invalido cantidad de pedido 
  ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: 100,
    costo_unitario: 10
  }
  ingrediente_pedido = {
    cantidad: -100,
    costo_total: 0,
    costo_unitario: 0
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 6 BIEN")
    console.log(error)
  } else {
    console.log("Test 6 MAL")
  }

  //invalido costo_total de pedido 
  ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: 100,
    costo_unitario: 10
  }
  ingrediente_pedido = {
    cantidad: 100,
    costo_total: -10,
    costo_unitario: 0
  }
  //invalido costo_total de pedido 
  ingrediente = {
    cantidad: 10,
    consumido: 0,
    costo_total: 100,
    costo_unitario: 10
  }
  ingrediente_pedido = {
    cantidad: 100,
    costo_total: 10,
    costo_unitario: -10
  }
  [result, error] = descontarIngredientePedido(ingrediente, ingrediente_pedido);
  if (error) {
    console.log("Test 7 BIEN")
    console.log(error)
  } else {
    console.log("Test 7 MAL")
  }


}
function TestDescontarPedidos() {
  tablaInvalidezDescontarPedidos();
}
function tablaInvalidezDescontarPedidos() {
  let ingrediente;
  let id_tipo_ingrediente;
  let indices;
  let pedidos;
  let result;
  let error;

  ingrediente = {
    cantidad: -10,
    consumido: 10,
    costo_unitario: 10,
    costo_total: 10
  }
  id_tipo_ingrediente = 1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 1 BIEN")
    console.log(error)
  } else {
    console.log("Test 1 MAL")
  }
  //TEST 2

  ingrediente = {
    cantidad: 10,
    consumido: -10,
    costo_unitario: 10,
    costo_total: 10
  }
  id_tipo_ingrediente = 1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 2 BIEN")
    console.log(error)
  } else {
    console.log("Test 2 MAL")
  }
  //TEST 3

  ingrediente = {
    cantidad: 10,
    consumido: 100,
    costo_unitario: 10,
    costo_total: 10
  }
  id_tipo_ingrediente = 1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 3 BIEN")
    console.log(error)
  } else {
    console.log("Test 3 MAL")
  }
  //TEST 4

  ingrediente = {
    cantidad: 10,
    consumido: 10,
    costo_unitario: -10,
    costo_total: 10
  }
  id_tipo_ingrediente = 1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 4 BIEN")
    console.log(error)
  } else {
    console.log("Test 4 MAL")
  }
  //TEST 5

  ingrediente = {
    cantidad: 10,
    consumido: 10,
    costo_unitario: 10,
    costo_total: -10
  }
  id_tipo_ingrediente = 1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 5 BIEN")
    console.log(error)
  } else {
    console.log("Test 5 MAL")
  }
  //TEST 6
  ingrediente = {
    cantidad: 10,
    consumido: 10,
    costo_unitario: 10,
    costo_total: 100
  }
  id_tipo_ingrediente = -1
  indices = {}
  pedidos = {
    fecha_compra: new Date(),
    ingredientes: [
      {
        cantidad: 10,
        costo_total: 100,
        costo_unitario: 10
      }
    ]
  };
  [result, error] = descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos)
  if (error) {
    console.log("Test 6 BIEN")
    console.log(error)
  } else {
    console.log("Test 6 MAL")
  }
  // creo que con eso es suficiente por ahora

}
async function extraerPlatillos(ids_platillo) {
  let listaPlatillos = []
  for (let i = 0; i < ids_platillo.length; i++) {
    let platillo = await AppDataSource.query(`
    SELECT *
    FROM platillo p
    WHERE id_platillo = $1
    `, [Number(ids_platillo)])
    if (!platillo || platillo.length === 0) {
      continue
    }
    console.log("platillo")
    console.log(platillo)
    let ingredientesDelPlatillo = await AppDataSource.query(`
      SELECT * 
      FROM tipo_ingrediente ti  
      INNER JOIN compuesto_platillo cp ON cp.id_tipo_ingrediente = ti.id_tipo_ingrediente
      WHERE cp.id_platillo = $1
    `, [platillo[0].id_platillo])
    if (!ingredientesDelPlatillo) {
      return [null, "¿Porque es nulo"]
    }
    platillo.ingredientes = ingredientesDelPlatillo;
    listaPlatillos.push(platillo)
  }
  return [listaPlatillos, null]
}

function calcularCostoPlatillo(platillos, comandas, mermas) {
  let listaCostosPlatillo = [];
  for(let i = 0; i < platillos.lenght; i++) {
    const platillo = platillos[i];
    //get comandas de platillo
    for(let ii = 0; ii < comandas.length; ii++) {
      //if comanda contiene el platillo sumar los costos de los ingredientes
      //y  
    }
    //get mermas de platillo
    //ordenarlas por fecha pero hacerlo de tal manera que todavia se pueda ordenar por hora
    listaCostosPlatillo.push()
  }
}