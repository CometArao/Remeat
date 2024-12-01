import GraficoLineal from '@components/GraficoLineal.jsx'
import GraficoBarra from "@components/GraficoBarra.jsx"
import GraficoCircular from "@components/GraficoCircular.jsx"
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
const data_circular = [
  {
    "id": "go",
    "label": "go",
    "value": 36,
    "color": "hsl(332, 70%, 50%)"
  },
  {
    "id": "php",
    "label": "php",
    "value": 542,
    "color": "hsl(297, 70%, 50%)"
  },
  {
    "id": "lisp",
    "label": "lisp",
    "value": 21,
    "color": "hsl(54, 70%, 50%)"
  },
  {
    "id": "elixir",
    "label": "elixir",
    "value": 354,
    "color": "hsl(140, 70%, 50%)"
  },
  {
    "id": "python",
    "label": "python",
    "value": 558,
    "color": "hsl(233, 70%, 50%)"
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
    formatedData = construirLineal(data.dependientes);
  }
  if (data.tipo.tipoGrafico == "barra") {
    if (data.independiente == "Hora") {
      //Mostrar interfaz para elegir hora
    }
    const [f, k] = construirBarra(data.dependientes);
    formatedData = f;
    keys = k;
  }
  if (data.tipo.tipoGrafico == "circular") {
    if (data.independiente == "Hora") {
      //Mostrar interfaz para elegir hora
    }
    console.log("CIRCULAR")
    formatedData = construirCircular(data.dependientes);
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
          <GraficoCircular data={formatedData}
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
  const colores = [
    "hsl(308, 70%, 50%)",
    "hsl(149, 70%, 50%)",
    "hsl(63, 70%, 50%)",
    "hsl(155, 70%, 50%)",
    "hsl(200, 70%, 50%)"
  ]
  for (let i = 0; i < keys.length; i++) {
    const ventas = datos[keys[i]]['ventas_por_comanda'];
    let indice_color = 0;
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
      "color": colores[indice_color],
      "data": formatedVentas
    }
    indice_color++;
    if(indice_color === colores.length) {
      indice_color = 0;
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

function construirCircular(datos) {
  const color_circular = "hsl(299, 70%, 50%)" //TODO: agregar una funcion para generar colores
  const keys = Object.keys(datos)
  let result = [];
  for(let i = 0; i < keys.length; i++) {
    const ventas = datos[keys[i]]["ventas_por_comanda"];
    let total = 0;
    for(let ii = 0; ii < ventas.length; ii++) {
      const venta = ventas[ii];
      total += venta.ingresos_platillo
    }
    const itemCircular = {
      "id": keys[i],
      "label": keys[i],
      "value": total,
      "color": color_circular
    }
    result.push(itemCircular)
  }
  return result;
}
export default Grafico