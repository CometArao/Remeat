import GraficoLineal from '@components/GraficoLineal.jsx'
import { useLocation } from 'react-router-dom'
import { getVentasPlatillo } from '@services/informes.service.js'
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
const Grafico = () => {
    const location = useLocation();
    const data = location.state;
    console.log("location state")
    console.log(data)
    if(data.independiente == "Hora") {
      //Mostrar interfaz para elegir hora
    }
    const formatedData = constructGraph(data.dependientes);
    console.log("formated Data")
    console.log(formatedData)

    return (
        <div>
            <h1>GRAFICO</h1>
            <div style={{ height: '80vh', marginTop: '10vh' }}>
              <GraficoLineal data={formatedData} />
            </div>
        </div>
    )
}
function constructGraph(datos) {
  let result = [];
  const keys = Object.keys(datos)
  for(let i = 0; i < keys.length; i++) {
    const ventas = datos[keys[i]]['ventas_por_comanda'];
    //if(/*independiente*/) {
      ////comprobar indenpendiente
    //}
    let formatedVentas = []
    for(let ii = 0; ii < ventas.length; ii++) {
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

export default Grafico