import ReactDOM from 'react-dom/client'; 
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import TipoUtensilio from '@pages/TipoUtensilio';
import GraficoLineal from '@components/GraficoLineal'
import GraficoCircular from '@components/GraficoCircular'
import GraficoBarra from '@components/GraficoBarra'
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Informes from '@pages/Informes'
import Grafico from './pages/Grafico.jsx';
import Mermas from '@pages/Mermas.jsx';
import CrearMermas from './pages/CrearMermas.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Proveedores from '@pages/Proveedores';
import Comandas from '@pages/Comandas'; 
import GenerateQRCode from '@pages/GenerateQRCode'; 
import Ingredientes from '@pages/Ingredientes';
import TipoIngrediente from '@pages/TipoIngrediente';
import UnidadesMedida from '@pages/UnidadMedida';
import  Platillos from '@pages/Platillos';
import Menu from './pages/Menu.jsx';
import ListadoDiarioMenuQrPage from '@pages/ListadoDiarioMenuQrPage';



const data_lineal2 = [
  {
    "id": "platillo_prueba1",
    "color": "hsl(308, 70%, 50%)",
    "data": [
      {
        "x": 14,
        "y": 100
      },
      {
        "x": 15,
        "y": 100
      }
    ]
  }
]
const data_lineal = [
  {
    "id": "japan",
    "color": "hsl(308, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 24
      },
      {
        "x": "helicopter",
        "y": 242
      },
      {
        "x": "boat",
        "y": 245
      },
      {
        "x": "train",
        "y": 128
      },
      {
        "x": "subway",
        "y": 87
      },
      {
        "x": "bus",
        "y": 279
      },
      {
        "x": "car",
        "y": 122
      },
      {
        "x": "moto",
        "y": 163
      },
      {
        "x": "bicycle",
        "y": 139
      },
      {
        "x": "horse",
        "y": 102
      },
      {
        "x": "skateboard",
        "y": 104
      },
      {
        "x": "others",
        "y": 104
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(149, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 226
      },
      {
        "x": "helicopter",
        "y": 2
      },
      {
        "x": "boat",
        "y": 87
      },
      {
        "x": "train",
        "y": 111
      },
      {
        "x": "subway",
        "y": 291
      },
      {
        "x": "bus",
        "y": 289
      },
      {
        "x": "car",
        "y": 198
      },
      {
        "x": "moto",
        "y": 3
      },
      {
        "x": "bicycle",
        "y": 185
      },
      {
        "x": "horse",
        "y": 50
      },
      {
        "x": "skateboard",
        "y": 59
      },
      {
        "x": "others",
        "y": 155
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(63, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 185
      },
      {
        "x": "helicopter",
        "y": 5
      },
      {
        "x": "boat",
        "y": 137
      },
      {
        "x": "train",
        "y": 91
      },
      {
        "x": "subway",
        "y": 292
      },
      {
        "x": "bus",
        "y": 164
      },
      {
        "x": "car",
        "y": 179
      },
      {
        "x": "moto",
        "y": 62
      },
      {
        "x": "bicycle",
        "y": 28
      },
      {
        "x": "horse",
        "y": 270
      },
      {
        "x": "skateboard",
        "y": 29
      },
      {
        "x": "others",
        "y": 8
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(155, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 224
      },
      {
        "x": "helicopter",
        "y": 34
      },
      {
        "x": "boat",
        "y": 273
      },
      {
        "x": "train",
        "y": 136
      },
      {
        "x": "subway",
        "y": 76
      },
      {
        "x": "bus",
        "y": 12
      },
      {
        "x": "car",
        "y": 184
      },
      {
        "x": "moto",
        "y": 268
      },
      {
        "x": "bicycle",
        "y": 95
      },
      {
        "x": "horse",
        "y": 18
      },
      {
        "x": "skateboard",
        "y": 164
      },
      {
        "x": "others",
        "y": 267
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(200, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 125
      },
      {
        "x": "helicopter",
        "y": 130
      },
      {
        "x": "boat",
        "y": 280
      },
      {
        "x": "train",
        "y": 265
      },
      {
        "x": "subway",
        "y": 25
      },
      {
        "x": "bus",
        "y": 274
      },
      {
        "x": "car",
        "y": 232
      },
      {
        "x": "moto",
        "y": 8
      },
      {
        "x": "bicycle",
        "y": 264
      },
      {
        "x": "horse",
        "y": 172
      },
      {
        "x": "skateboard",
        "y": 251
      },
      {
        "x": "others",
        "y": 67
      }
    ]
  }
]
const data_barra = [
  {
    "country": "AD",
    "hot dog": 194,
    "hot dogColor": "hsl(206, 70%, 50%)",
    "burger": 79,
    "burgerColor": "hsl(299, 70%, 50%)",
    "sandwich": 192,
    "sandwichColor": "hsl(139, 70%, 50%)",
    "kebab": 18,
    "kebabColor": "hsl(58, 70%, 50%)",
    "fries": 175,
    "friesColor": "hsl(19, 70%, 50%)",
    "donut": 46,
    "donutColor": "hsl(241, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 119,
    "hot dogColor": "hsl(314, 70%, 50%)",
    "burger": 184,
    "burgerColor": "hsl(263, 70%, 50%)",
    "sandwich": 110,
    "sandwichColor": "hsl(3, 70%, 50%)",
    "kebab": 68,
    "kebabColor": "hsl(327, 70%, 50%)",
    "fries": 172,
    "friesColor": "hsl(271, 70%, 50%)",
    "donut": 21,
    "donutColor": "hsl(25, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 69,
    "hot dogColor": "hsl(124, 70%, 50%)",
    "burger": 200,
    "burgerColor": "hsl(134, 70%, 50%)",
    "sandwich": 5,
    "sandwichColor": "hsl(77, 70%, 50%)",
    "kebab": 33,
    "kebabColor": "hsl(193, 70%, 50%)",
    "fries": 180,
    "friesColor": "hsl(19, 70%, 50%)",
    "donut": 181,
    "donutColor": "hsl(123, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 44,
    "hot dogColor": "hsl(17, 70%, 50%)",
    "burger": 152,
    "burgerColor": "hsl(71, 70%, 50%)",
    "sandwich": 78,
    "sandwichColor": "hsl(169, 70%, 50%)",
    "kebab": 163,
    "kebabColor": "hsl(19, 70%, 50%)",
    "fries": 58,
    "friesColor": "hsl(16, 70%, 50%)",
    "donut": 133,
    "donutColor": "hsl(91, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 17,
    "hot dogColor": "hsl(298, 70%, 50%)",
    "burger": 88,
    "burgerColor": "hsl(58, 70%, 50%)",
    "sandwich": 171,
    "sandwichColor": "hsl(335, 70%, 50%)",
    "kebab": 128,
    "kebabColor": "hsl(348, 70%, 50%)",
    "fries": 179,
    "friesColor": "hsl(78, 70%, 50%)",
    "donut": 134,
    "donutColor": "hsl(202, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 3,
    "hot dogColor": "hsl(247, 70%, 50%)",
    "burger": 84,
    "burgerColor": "hsl(283, 70%, 50%)",
    "sandwich": 93,
    "sandwichColor": "hsl(224, 70%, 50%)",
    "kebab": 200,
    "kebabColor": "hsl(121, 70%, 50%)",
    "fries": 62,
    "friesColor": "hsl(302, 70%, 50%)",
    "donut": 166,
    "donutColor": "hsl(32, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 135,
    "hot dogColor": "hsl(190, 70%, 50%)",
    "burger": 8,
    "burgerColor": "hsl(258, 70%, 50%)",
    "sandwich": 181,
    "sandwichColor": "hsl(43, 70%, 50%)",
    "kebab": 53,
    "kebabColor": "hsl(186, 70%, 50%)",
    "fries": 146,
    "friesColor": "hsl(133, 70%, 50%)",
    "donut": 159,
    "donutColor": "hsl(199, 70%, 50%)"
  }
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



const router = createBrowserRouter([ 
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/inicio',
        element: <Home />
      },
      {
        path: '/menu-dia', // Ruta base sin parámetro
        element: <ListadoDiarioMenuQrPage />,
    },
      {
        path: '/menu-dia/:id_menu', // Nueva ruta para el menú diario
        element: <ListadoDiarioMenuQrPage />, // Sin protección, accesible para todos
      },
      {
        path: '/usuarios',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tipo_utensilio',
        element: (
          <ProtectedRoute allowedRoles={['administrador','cocinero']}>
            <TipoUtensilio />
          </ProtectedRoute>
        ),
      },
      {
        path: '/menus',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'cocinero', 'mesero']}>
            <Menu />
          </ProtectedRoute>
        ),
      },
     {
        path: '/platillos',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'cocinero']}>
            <Platillos />
        </ProtectedRoute>
      ),
     },
       {
        path: '/ingredientes/', 
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'cocinero']}>
            <Ingredientes />
          </ProtectedRoute>
       ),
      },
      {
        path: '/tipos_ingredientes',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'cocinero']}>
            <TipoIngrediente />
          </ProtectedRoute>
        ),
      },
      {
        path: '/mermas',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Mermas />
          </ProtectedRoute>
        ),
      },
      //TODO: porque la navbar se sube en las pestañas de graficos
      {
        path: '/grafico',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Grafico/>
          </ProtectedRoute>
        ),
      },
      {
        path: '/grafico1',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <div style={{ height: '80vh', marginTop: '10vh' }}>
              <GraficoLineal data={data_lineal2} legendX = {"test"} legendY = {"testy"}/>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/grafico2',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <div style={{ height: '80vh', marginTop: '10vh' }}>
              <GraficoBarra data={mdata_barra} keys= {
                ['hallulla', 'pan frances', 'pan de ajo', 'pan integral']
              }
              //[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
              />
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/grafico3',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <div style={{ height: '80vh', marginTop: '10vh' }}>
              <GraficoCircular data={data_circular} keys={[
                'hot dog',
                'burger',
                'sandwich',
                'kebab',
                'fries',
                'donut'
              ]}/>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/informes',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Informes />
          </ProtectedRoute>
        ),
      },
      {
        path: '/crear_mermas',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <CrearMermas />
          </ProtectedRoute>
        ),
      },
      {
        path: '/comandas', // Ruta para comandas, accesible solo para mesero
        element: (
          <ProtectedRoute allowedRoles={['mesero']}>
            <Comandas />
          </ProtectedRoute>
        ),
      },
      {
        path: '/menu/generate-qr', // Ruta para generar QR, accesible solo para mesero
        element: (
          <ProtectedRoute allowedRoles={['mesero']}>
            <GenerateQRCode />
          </ProtectedRoute>
        ),
      },
      {
        path: '/pedidos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Pedidos />
          </ProtectedRoute>
        ),
      },
      {
        path: '/proveedores',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Proveedores />
          </ProtectedRoute>
        ),
      },
      {
        path: '/unidades_medidas',
        element: (
            <ProtectedRoute allowedRoles={['administrador', 'cocinero']}>
                <UnidadesMedida />
            </ProtectedRoute>
        ),
    },
    
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
