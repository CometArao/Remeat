import GraficoLineal from '@components/GraficoLineal.jsx'
import GraficoBarra from "@components/GraficoBarra.jsx"
import GraficoCircular from "@components/GraficoCircular.jsx"
import { useLocation } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import '@styles/informe.css';
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
  const handleImprimirPdf = () => {
    const element = document.getElementById('kairos')
    const opt = {
      margin: 1,
      filename: "graph.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,  // Increase the scale factor for better resolution
        width: 3000,  // Adjust the width of the content as per your graph's size
        height: 1500,  // Adjust the height accordingly
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape", // Change to landscape for wider graphs
      },
    };
    const pageWidth = window.innerWidth;
    const opt2 = {
      margin: 1,
      filename: "graph.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3, // Increase the scale factor for higher resolution
        width: pageWidth, // Set the width of the graph to match the page width
        height: 1500, // Set the height based on your graph's height
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "landscape", // Use landscape orientation for wide graphs
      },
    };
    html2pdf().from(element).set(opt2).save()
  }
  return (
    <div>
      <div id="kairos">
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
      <div className='botones centrar'>
        <button onClick={handleImprimirPdf}>Imprimir como pdf</button>
      </div>
    </div>
  )
}


export default Grafico