import GraficoLineal from '@components/GraficoLineal.jsx'
import GraficoBarra from "@components/GraficoBarra.jsx"
import GraficoCircular from "@components/GraficoCircular.jsx"
import { useLocation } from 'react-router-dom'
//Los datos x de 1 tienen que aparecer en los otros, pero estos pueden aparecer
//como nulos
//Este componente prepara todo para mostrar el grafico lineal
const Grafico = () => {
  const location = useLocation();
  const data = location.state;
  console.log("grafico")
  console.log(data)
  console.log(data.dependientes)
  console.log(data.keys)
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
            keys={data.keys} />
        }
      </div>
    </div>
  )
}


export default Grafico