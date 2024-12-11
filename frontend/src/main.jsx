import ReactDOM from 'react-dom/client'; 
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import TipoUtensilio from '@pages/TipoUtensilio';
import Utensilios from '@pages/Utensilio';
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
import Platillos from '@pages/Platillos';
import ConfirmaPlatillo from './pages/ConfirmaPlatillo';
import Menu from './pages/Menu.jsx';
import CrearPedido from './pages/CrearPedido';
import ListadoDiarioMenuQrPage from '@pages/ListadoDiarioMenuQrPage';


const router = createBrowserRouter([ 
  {
    path: '/menu-dia',
    element: <ListadoDiarioMenuQrPage />, 
},

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
        path: '/usuarios',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tipo_utensilios',
        element: (
          <ProtectedRoute allowedRoles={['administrador','cocinero']}>
            <TipoUtensilio />
          </ProtectedRoute>
        ),
      },
      {
        path: '/utensilios',
        element: (
          <ProtectedRoute allowedRoles={['administrador','cocinero']}>
            <Utensilios />
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
      path: '/platillos/confirma-platillo',
      element: (
        <ProtectedRoute allowedRoles={['cocinero']}>
          <ConfirmaPlatillo />
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
          <ProtectedRoute allowedRoles={['mesero','cocinero']}>
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
        path: '/crear_pedido',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <CrearPedido /> {/* Nuevo componente para la creación de pedidos */}
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
