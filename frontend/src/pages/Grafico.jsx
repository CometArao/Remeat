import GraficoLineal from '@components/GraficoLineal.jsx'
import GraficoBarra from "@components/GraficoBarra.jsx"
import GraficoCircular from "@components/GraficoCircular.jsx"
import { useLocation } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import '@styles/informe.css';
import { useNavigate } from 'react-router-dom';
//Los datos x de 1 tienen que aparecer en los otros, pero estos pueden aparecer
//como nulos
//Este componente prepara todo para mostrar el grafico lineal
const Grafico = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  console.log("grafico")
  console.log(data)
  console.log(data.dependientes)
  console.log(data.keys)
  const handleImprimirPdf = () => {
    const element = document.getElementById('kairos')
    const pageWidth = window.innerWidth;
    const opcionesDocumento = {
      margin: 1,
      filename: "graph.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3, 
        width: pageWidth, 
        height: 1500, 
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape", 
      },
    };
    html2pdf().from(element).set(opcionesDocumento).save()
  }
  const handleRedirect = () => {
    navigate('/Informes');
  }
  return (
    <div style={{ marginTop: "10vh" }}>
      <button style={{"margin": "2vh"}} onClick={handleRedirect}>Volver</button>
      <div id="kairos" >
        <h1 style={{ "textAlign": "center", "margin": "0" }} className='title-table'>{data.tipo.titulo}</h1>
        <div style={{ height: '70vh'}}>
          {data.tipo.tipoGrafico == "lineal" &&
            <GraficoLineal data={data.dependientes}
              legendX={data.independientes.name} legendY={data.tipo.titulo} />
          }
          {data.tipo.tipoGrafico == "barra" &&
            <GraficoBarra data={data.dependientes}
              keys={data.keys} legendX={null} legendY={data.tipo.titulo} />
          }
          {data.tipo.tipoGrafico == "circular" &&
            <GraficoCircular data={data.dependientes}
              keys={data.keys} />
          }
        </div>
      </div>
      <div className='botones centrar'>
        <button onClick={handleImprimirPdf}>Imprimir como pdf</button>
      </div>
    </div>
  )
}


export default Grafico