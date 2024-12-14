import { AppDataSource } from "../config/configDb.js";
import Platillo from "../entity/platillo.entity.js"

export async function getCostosService(body) {
  const { ids_platillo, ids_tu } = body;
  //Extraer datos
  const [comandas, errorComandas] = await ExtraerComandas();
  if (errorComandas) {
    return [null, "Error en extraer comandas"]
  }
  const [pedidos, errorPedidos] = await ExtraerPedido();
  if (errorPedidos) {
    return [null, "Error en extraer Pedidos"]
  }
  let [mermas, errorMerma] = await extraerMermas()
  if (errorMerma) {
    return [null, "Error en extraer mermas"]
  }
  //Calcular los costos
  //Tiene que evaluar todas las comandas primero para que 
  //los costos no sean inconsistentes
  let CostoComanda = costoFIFO(comandas, pedidos);
  let [CostoPlatillo, errorCalcularPlatillo] = await calcularCostoPlatillo(CostoComanda, ids_platillo, mermas);
  //Calcular mermas de los platillos
  //mermas de utensilios
  return [CostoPlatillo, null]
}
//Que valores nesesito para que funcione:
//Lista de platillos con id y nombre.
//Cada uno de estos platillos tiene una lista de eventos (comandas y mermas)
//Cada uno de estos eventos tiene fecha(la cual contiene una hora) y el costo de ese evento
async function calcularCostoPlatillo(costoComanda, ids_platillo) {
  let listaPlatillos = []
  let tieneNombre = false
  console.log("ids_platillo")
  console.log(ids_platillo)
  for (let i = 0; i < ids_platillo.length; i++) {
    let miPlatillo = {
      id_platillo: ids_platillo[i],
      nombre_platillo: null,
      comandas: null
    }
    let listaComandas = [];
    for (let ii = 0; ii < costoComanda.length; ii++) {
      const comanda = costoComanda[ii]
      const [costo, utilidad] = buscarPlatilloComanda(comanda.platillos, miPlatillo, tieneNombre)
      //Si es nulo es porque la comanda no contiene platillos
      if(!costo) {
        continue
      }
      let miComanda = {
        fecha: comanda.fecha,
        id_comanda: comanda.id_comanda,
        costo: costo,
        utilidad: utilidad
      }
      listaComandas.push(miComanda);
    }
    miPlatillo.comandas = listaComandas;
    if(!miPlatillo.nombre_platillo) {
      const platillo = await AppDataSource.query(`
        SELECT *
        FROM platillo p   
        WHERE p.id_platillo = $1
      `, [miPlatillo.id_platillo])
      miPlatillo.nombre_platillo = platillo[0].nombre_platillo
    }
    listaPlatillos.push(miPlatillo);
  }
  return [listaPlatillos, null]
}
function buscarPlatilloComanda(platillosComanda, miPlatillo, tieneNombreFlag) {
  for (let i = 0; i < platillosComanda.length; i++) {
    const platillo = platillosComanda[i];
    if (platillo.id_platillo === miPlatillo.id_platillo) {
      if (!tieneNombreFlag) {
        miPlatillo.nombre_platillo = platillo.nombre_platillo
      }
      const test = sumarCostosIngredientes(platillo);
      console.log("testsumar")
      console.log(test)
      const [costo, utilidad] = sumarCostosIngredientes(platillo);
      return [costo, utilidad]
    }
  }
  return [null, null]
}
function sumarCostosIngredientes(platillo) {
  //TODO: sumar costo
  let costo = 0
  for(let i = 0; i < platillo.ingredientes.length; i++) {
    const ingrediente = platillo.ingredientes[i];
    costo += ingrediente.costo_total;
  }
  const ingresos_venta = platillo.cantidad_platillo * platillo.precio_platillo
  const utilidad = ingresos_venta - costo;

  return [costo, utilidad]
}

async function ExtraerComandas() {
  let listaComandas = []
  const comandas = await AppDataSource.query(`
    SELECT *
    FROM comanda c
    ORDER BY fecha_compra_comanda 
    `)
  if (!comandas || comandas.lenght === 0) {
    console.log("Error 3")
    return [null, "No hay comandas"];
  }
  for (let i = 0; i < comandas.length; i++) {
    const [comanda, error] = await formatearComanda(comandas[i]);
    listaComandas.push(comanda)
  }
  return [listaComandas, null];
}
async function formatearComanda(comanda) {
  console.log("comanda")
  console.log(comanda)
  let comandaDiccionario = {}
  comandaDiccionario["id_comanda"] = comanda.id_comanda
  comandaDiccionario["fecha"] = comanda.fecha_compra_comanda;
  comandaDiccionario["hora_compra_comanda"] = comanda.hora_compra_comanda;

  let platillosFormateados = []
  console.log(comandaDiccionario.id_comanda)
  const platillos = await AppDataSource.query(`
    SELECT *
    FROM platillo p    
    INNER JOIN conforma_comanda cc ON cc.id_platillo = p.id_platillo
    WHERE cc.id_comanda = $1
    `, [comandaDiccionario.id_comanda])
  console.log("platillos")
  console.log(platillos)
  //if(!platillos) {
  //return [null, "No hay platillos"]
  //}
  for (let i = 0; i < platillos.length; i++) {
    const platillo = platillos[i]
    const ingredientes = await AppDataSource.query(`
            SELECT * 
            FROM tipo_ingrediente ti
            INNER JOIN compuesto_platillo cp ON cp.id_tipo_ingrediente = ti.id_tipo_ingrediente
            WHERE cp.id_platillo = $1
        `, [platillo.id_platillo])
    platillo.ingredientes = ingredientes;
    platillosFormateados.push(platillo)
  }
  comandaDiccionario.platillos = platillosFormateados;
  return [comandaDiccionario, null];
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
  return [mermas, null]
}
function agregarIngredientesAMermas(merma, ingredientes) {
  for (let ii = 0; ii < ingredientes.length; ii++) {
    const ingrediente = ingredientes[ii];
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
function costoFIFO(comandas, pedidos) {
  let indices = {}
  for (let i = 0; i < comandas.length; i++) {
    const comanda = comandas[i];
    const platillos_comanda = comanda.platillos
    for (let ii = 0; ii < platillos_comanda.length; ii++) {
      const platillo = platillos_comanda[ii];
      const ingredientes_platillo = platillo.ingredientes;
      for (let iii = 0; iii < ingredientes_platillo.length; iii++) {
        let ingrediente_platillo = ingredientes_platillo[iii]
        ingrediente_platillo.cantidad =
          ingrediente_platillo.porcion_ingrediente_platillo *
          platillo.cantidad_platillo
        descontarPedidos(ingrediente_platillo,
          ingrediente_platillo.id_tipo_ingrediente,
          indices, pedidos
        )
      }
    }
  }
  return comandas;
}
function descontarPedidos(ingrediente, id_tipo_ingrediente, indices, pedidos) {
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
    const keys_ingredientes_pedido = Object.keys(pedido.ingredientes)
    for (let ii = 0; ii < keys_ingredientes_pedido.length; ii++) {
      const key = keys_ingredientes_pedido[ii]
      const ingrediente = pedido.ingredientes[key];
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