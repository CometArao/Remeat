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
  console.log("data")
  console.log(data)
  //let formatedData = null;
  //let keys = null;
  //console.log("data en Grafico")
  //console.log(data)
  //if (data.tipo.tipoGrafico == "lineal") {
    ////formatedData = construirLineal(data.dependientes);
    //console.log("formatedData")
    //console.log(formatedData)
    //if (data.independientes.name == "Hora") {
      ////Mostrar interfaz para elegir hora
      //console.log("hora")
      //formatedData.sort((a,b) => a.data.x - b.data.x)

    //}
  //}
  //if (data.tipo.tipoGrafico == "barra") {
    //if (data.independiente == "Hora") {
      ////Mostrar interfaz para elegir hora
    //}
    //const [f, k] = construirBarra(data.dependientes);
    //formatedData = f;
    //keys = k;
  //}
  //if (data.tipo.tipoGrafico == "circular") {
    //if (data.independiente == "Hora") {
      ////Mostrar interfaz para elegir hora
    //}
    //console.log("CIRCULAR")
    //formatedData = construirCircular(data.dependientes);
  //}
  return (
    <div>
      <h1>GRAFICO</h1>
      <div style={{ height: '80vh', marginTop: '10vh' }}>
        {data.tipo.tipoGrafico == "lineal" &&
          <GraficoLineal data={data.dependientes}
            legendX={data.independientes.name} legendY={data.tipo.variable} />
        }
        {data.tipo.tipoGrafico == "barra" &&
          <GraficoBarra data={data.dependientes}
            keys={data.keys} legendX={null} legendY={data.tipo.variable} />
        }
        {data.tipo.tipoGrafico == "circular" &&
          <GraficoCircular data={data.dependientes}
            legendX={data.independientes.name} legendY={data.tipo.variable} />
        }
      </div>
    </div>
  )
}


export default Grafico