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
  const { ids_ti, ids_tu } = body;
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
  let CostoComanda = costoFIFO(comandas, pedidos);
  calcularCostoVentaDeComandasEnBaseAFiltro(ids_ti, CostoComanda)
  calcularCostoMermasEnBaseAFiltro(mermas, ids_ti, ids_tu);
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
    merma.costo_merma = costo_merma;
  }
}
function getCostoMerma(merma, ids_ti, ids_tu) {
  let costo_merma = 0;
  const ingredientes = merma.ingredientes;
  if (ingredientes && ingredientes.length != 0) {
    for (let i = 0; i < ids_ti.length; i++) {
      const id_tipo_ingrediente = ids_ti[i];
      if (ingredientes[id_tipo_ingrediente]) {
        costo_merma += ingredientes[id_tipo_ingrediente].costo_total
      }
    }
  }
  const utensilios = merma.utensilios;
  if (utensilios && utensilios.length != 0) {
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
    SELECT im.cantidad_perdida_ingrediente, i.costo_ingrediente, i.cantidad_original_ingrediente, 
      ti.id_tipo_ingrediente, ti.nombre_tipo_ingrediente
    FROM ingrediente_merma im
    INNER JOIN ingrediente i ON i.id_ingrediente = im.id_ingrediente
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_tipo_ingrediente
    WHERE im.id_merma = $1
    `, [merma.id_merma])
    merma.ingredientes = {}
    if (ingredientes || ingredientes.length !== 0) {
      //agregar los ingredientes correspondientes a la merma
      agregarIngredientesAMermas(merma, ingredientes);
    }
    const utensilios = await AppDataSource.query(`
    SELECT um.cantidad_perdida_utensilio, u.costo_utensilio, u.cantidad_utensilio, 
      tu.nombre_tipo_utensilio, tu.id_tipo_utensilio
    FROM utensilio u
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
    const costo_unitario_ingrediente = ingrediente.costo_ingrediente / ingrediente.cantidad_original_ingrediente;
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
function calcularCostoVentaDeComandasEnBaseAFiltro(ids_ti, CostoEnComandas) {
  //TODO: validationQuery
  //TODO: agregar calculo de ventas al costo FIFO
  for (let i = 0; i < CostoEnComandas.length; i++) {
    const CostoComanda = CostoEnComandas[i];
    const ingredientes = CostoComanda.ingredientes;
    const costo_de_comanda = CalcularCostoVentaDeComanda(ids_ti, ingredientes);
    CostoComanda.costo_comanda = costo_de_comanda;
  }
}

//TODO: prueba unitaria
function CalcularCostoVentaDeComanda(ids_ti, ingredientes) {
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
//TODO: Como se que ingrediente pertenece a que comanda, solo asi puedo saber
//el costo por ingrediente
//Solucion parcial: 1. No hacer costos por ingrediente
//2. Usar costo promedio.

/**
 descripcion: Calcula el costo de las comandas describiendo cuanto costo cada ingrediente
 usado por unidad y su costo total. Entonces se calcula el costo de todas las comandas y solo 
 entonces se separa.
 comandas: Una lista de todas las comandas
 ingrediente: Lista de ingredientes y pedidos ordenados de forma ascendente
 este deberia tener la forma
 ingredientes: {
  id_pedido: {
    fecha: fecha

  }
 }
  //si hago un join pedido->ingrediente->tipo_ingrediente
  //y luego guardo un indice por ingrediente
 retorna: 
 result = {
  id_comanda: {
    fecha: fecha_comanda,
    hora: hora_comanda
    ingrediente: {
      costo_unitario: x
      unidades: y
      costo_total: x * y
    }...(otros ingredientes)
  }
 }
 */
/*
    SELECT c.fecha_compra_comanda, cc.cantidad_platillo, cp.porcion_ingrediente_platillo, 
      p.precio_platillo
*/
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
    if (!platillos || platillos.length === 0) {
      return [null, "No existen platillos para la comanda; Esto deberia ser imposible"];
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
          elemento = ingrediente[tipo_ingrediente.id_tipo_ingrediente]
          elemento["cantidad"] += costo_platillo
        }
      }
    }
    comanda_diccionario["ingredientes"] = ingredientes;
    result.push(comanda_diccionario)
  }
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
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_tipo_ingrediente
    WHERE i.id_pedido = $1
    `, [pedido.id_pedido])
    if (!ingredientes_de_pedido || ingredientes_de_pedido.length === 0) {
      //Seguir con el proximo pedido
      continue;
    }
    let ingredientes = {}
    //TODO: para cada pedido ¿solo una tabla de ingredientes por tipo?
    for (let ii = 0; ii < ingredientes_de_pedido.length; ii++) {
      const ingrediente_pedido = ingredientes_de_pedido[ii];
      let ingrediente = {}
      ingrediente["cantidad"] = ingrediente_pedido.cantidad_ingrediente;
      ingrediente["costo_unitario"] = ingrediente_pedido.costo_ingrediente;
      ingrediente["costo_total"] =
        ingrediente_pedido.costo_ingrediente * ingrediente_pedido.cantidad_ingrediente;
      ingredientes[ingrediente_pedido.id_tipo_ingrediente] = ingrediente;
    }
    pedido_diccionario["ingredientes"] = ingredientes;
    result.push(pedido_diccionario)
  }
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
  return comandas
}
/*
  Descuenta el ingrediente teniendo en cuenta los pedidos, a los cuales 
  se accede con un diccionario de indices para evitar una busqueda lineal
  cada vez que miro se revisa una comanda nueva
*/
//TODO: test unitario
function descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos) {
  if (!ingrediente.consumido) {
    ingrediente.consumido = 0;
    ingrediente.costo_total = 0;
    ingrediente.costo_unitario = 0;
  }
  //console.log(pedidos)
  if (!indices[id_tipo_ingrediente]) {
    indices[id_tipo_ingrediente] = 0
  }
  //console.log(indices[tipo_ingrediente])
  while (ingrediente.consumido < ingrediente.cantidad) {
    const rc = descontarIngredientePedido(ingrediente,
      pedidos[indices[id_tipo_ingrediente]]["ingredientes"][id_tipo_ingrediente])
    if (rc == 1) {
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
//TODO: test unitario
function descontarIngredientePedido(ingrediente, ingrediente_pedido) {
  if (!ingrediente.consumido) {
    ingrediente_pedido["consumido"] = 0;
  }
  if (ingrediente_pedido === null) {
    return 1;
  }
  if ((ingrediente_pedido.cantidad - ingrediente_pedido.consumido) <= ingrediente.cantidad) {
    ingrediente_pedido.consumido = ingrediente_pedido.cantidad;//Se consume todo
    ingrediente.consumido += ingrediente_pedido.cantidad; //Queda por descontar una cantidad menor
    ingrediente.costo_total += ingrediente_pedido.costo_total //se usa total porque se consume todo
    return 1;
  } else {//Caso los ingredientes que quedan en este pedido son mas que los de la comanda
    const cantidad_consumir = ingrediente.cantidad - ingrediente.consumido;
    ingrediente_pedido.consumido += cantidad_consumir; //se consume toda la cantidad
    ingrediente.consumido = cantidad_consumir;//No queda por descontar
    ingrediente.costo_total += cantidad_consumir * ingrediente_pedido.costo_unitario;
    return 0;
  }
}