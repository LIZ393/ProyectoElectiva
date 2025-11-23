using System.Collections.ObjectModel;
using SagradoAbadAPP.Modelos;
using SagradoAbadAPP.Servicios;

namespace SagradoAbadAPP.Vistas
{
    public partial class OrdenView : ContentPage
    {
        public ObservableCollection<CarritoDetalle> ProductosCarrito { get; set; }
        private readonly ProductosServicio _productosServicio;

        public OrdenView(ObservableCollection<CarritoDetalle> productosCarrito)
        {
            InitializeComponent();

            ProductosCarrito = productosCarrito;
            ResumenPedidoCollection.ItemsSource = ProductosCarrito;
            _productosServicio = new ProductosServicio();
        }

        private async void ConfirmarButton_Clicked(object sender, EventArgs e)
        {
            // Validaciones simples
            if (string.IsNullOrWhiteSpace(NombreEntry.Text) ||
                string.IsNullOrWhiteSpace(DireccionEditor.Text) ||
                string.IsNullOrWhiteSpace(TelefonoEntry.Text) ||
                string.IsNullOrWhiteSpace(EmailEntry.Text) ||
                PagoPicker.SelectedIndex < 0)
            {
                await DisplayAlert("Error", "Por favor complete todos los campos.", "OK");
                return;
            }

            // Aquí iría la lógica real para procesar el pago y la orden
            // Por ahora simulamos éxito
            var ordenData = new NuevaOrden
            {
                EstadoEnvio = "Pendiente",
                MetodoPago = PagoPicker.SelectedItem.ToString(),
                UsuarioId = "4d7b1678-5c2a-4021-85da-70ecd2b70ebc"
            };
           var response =  await _productosServicio.CrearOrden(ordenData);
            if (response == null)
            {
                await DisplayAlert("Error", "Hubo un error creando la orden, intentalo en unos instantes", "Ok");

            }


            await DisplayAlert("¡Gracias!", "Su orden ha sido procesada con éxito.", "OK");

            // Opcional: navegar atrás o limpiar formulario
            await Navigation.PopToRootAsync();
        }
    }
}
