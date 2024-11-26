import GraficoLineal from '@components/GraficoLineal.jsx'
import GraficoBarra from "@components/GraficoBarra.jsx"
import { useLocation } from 'react-router-dom'
//Los datos x de 1 tienen que aparecer en los otros, pero estos pueden aparecer
//como nulos
const mdata_lineal = [
  {
    "id": "test",
    "color": "hsl(308, 70%, 50%)",
    "data": [
      {
        "x": 1,
        "y": 5
      },
      {
        "x": 2,
        "y": 7
      },
      {
        "x": 4,
        "y": 9
      },
    ]
  },
  {
    "id": "test1",
    "color": "hsl(80, 70%, 50%)",
    "data": [
      {
        "x": 1,
        "y": 10
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 4,
        "y": 10
      },
    ]
  },
  {
    "id": "test2",
    "color": "hsl(30, 70%, 50%)",
    "data": [
      {
        "x": 1,
        "y": 12
      },
      {
        "x": 2,
        "y": 7
      },
      {
        "x": 4,
        "y": 4
      },
    ]
  },
]
const color_barra = "hsl(299, 70%, 50%)"
const mdata_barra = [
  {
    "nombre_platillo": "hallulla",
    "hallulla": 194,
    "color_barra": color_barra,
  },
  {
    //Los tilde dan problemas
    "nombre_platillo": "pan frances",
    "pan frances": 184,
    "color_barra": color_barra
  },
  {
    "nombre_platillo": "pan de ajo",
    "pan de ajo": 53,
    "color_barra": color_barra
  },
  {
    "nombre_platillo": "pan integral",
    "pan integral": 154,
    "color_barra": color_barra
  }
]
//Este componente prepara todo para mostrar el grafico lineal
const Grafico = () => {
  const location = useLocation();
  const data = location.state;
  let formatedData = null;
  let keys = null;
  if (data.tipo.tipoGrafico == "lineal") {
    if (data.independiente == "Hora") {
      //Mostrar interfaz para elegir hora
    }
    const formatedData = construirLineal(data.dependientes);
    console.log("formated Data")
    console.log(formatedData)
  }
  if (data.tipo.tipoGrafico == "barra") {
    if (data.independiente == "Hora") {
      //Mostrar interfaz para elegir hora
    }
    const [f, k] = construirBarra(data.dependientes);
    formatedData = f;
    keys = k;
    console.log("formated Data")
    console.log(formatedData)
    console.log("keys")
    console.log(keys)
  }

  return (
    <div>
      <h1>GRAFICO</h1>
      <div style={{ height: '80vh', marginTop: '10vh' }}>
        {data.tipo.tipoGrafico == "lineal" &&
          <GraficoLineal data={formatedData}
            legendX={data.independientes.name} legendY={data.tipo.variable} />
        }
        {data.tipo.tipoGrafico == "barra" &&
          <GraficoBarra data={formatedData}
            keys={keys} legendX={null} legendY={data.tipo.variable} />
        }
        {data.tipo.tipoGrafico == "circular" &&
          <GraficoLineal data={formatedData}
            legendX={data.independientes.name} legendY={data.tipo.variable} />
        }
      </div>
    </div>
  )
}

//TODO: pruebas
function construirLineal(datos) {
  let result = [];
  const keys = Object.keys(datos)
  for (let i = 0; i < keys.length; i++) {
    const ventas = datos[keys[i]]['ventas_por_comanda'];
    //if(/*independiente*/) {
    ////comprobar indenpendiente
    //}
    let formatedVentas = []
    for (let ii = 0; ii < ventas.length; ii++) {
      const obj = {
        "x": ventas[ii].hora_compra,
        "y": ventas[ii].ingresos_platillo
      }
      formatedVentas.push(obj);
    }
    const obj = {
      "id": keys[i],
      "color": "hsl(308, 70%, 50%)",
      "data": formatedVentas
    }
    result.push(obj);
  }
  return result;
}
//TODO: pruebas
function construirBarra(datos) {
  const color_barra = "hsl(299, 70%, 50%)"
  let result = [];
  let keys = Object.keys(datos);

  for (let i = 0; i < keys.length; i++) {
    const ventas = datos[keys[i]]['ventas_por_comanda'];
    console.log("ventas")
    console.log(ventas)
    let total = 0;
    for (let ii = 0; ii < ventas.length; ii++) {
      const venta = ventas[ii];
      console.log("total")
      console.log(total)
      total += venta.ingresos_platillo;
    }
    console.log("total")
    console.log(total)
    const itemBar = {
      "nombre_platillo": keys[i],
      [keys[i]]: total,
      "color_barra": color_barra
    }
    result.push(itemBar);
  }
  return [result, keys];
}

export default Grafico