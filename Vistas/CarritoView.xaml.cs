using System.Collections.ObjectModel;
using System.Threading.Tasks;
using SagradoAbadAPP.Modelos;
using SagradoAbadAPP.Servicios;

namespace SagradoAbadAPP.Vistas;

public partial class CarritoView : ContentPage
{
    private readonly ProductosServicio _productosServicio;
    public ObservableCollection<CarritoDetalle> ProductosCarrito { get; set; }
    private decimal _totalCarrito;
    public decimal TotalCarrito
    {
        get => _totalCarrito;
        set
        {
            _totalCarrito = value;
            OnPropertyChanged(nameof(TotalCarrito));
        }
    }


    public CarritoView()
	{
		InitializeComponent();
        _productosServicio = new ProductosServicio();
        ProductosCarrito = new ObservableCollection<CarritoDetalle>();
        BindingContext = this;
        CalcularTotal();
        ProductosCarrito.CollectionChanged += (s, e) => CalcularTotal();

    }

    private void CalcularTotal()
    {
        TotalCarrito = ProductosCarrito.Sum(p => p.Producto.Precio * p.Cantidad);
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        await LoadDetalles();
    }

    public  async Task LoadDetalles()
    {
        try
        {
            var detallesCarrito = await _productosServicio.getCurrentUserCarrito("4d7b1678-5c2a-4021-85da-70ecd2b70ebc");
            ProductosCarrito.Clear();
            foreach (var detalle in detallesCarrito.Detalles)
            {
                ProductosCarrito.Add(detalle);
                Console.WriteLine(detalle.Producto.NombreProducto);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error cargando carrito: {ex.Message}");
        }
    }


    private async void DisminuirCantidad(object sender, EventArgs e)
    {
        var button = (Button)sender;
        var detalle = (CarritoDetalle)button.BindingContext;
        int nuevaCantidad = detalle.Cantidad - 1;

        if (detalle.Cantidad <= 1)
        {
             await DisplayAlert("Error", "Minimo un producto", "OK");
            return;
        }

        var response = await _productosServicio.ActualizarCantidadProductoCarrito(detalle.IdDetalle, nuevaCantidad);
        if (response != null)
        {
            await LoadDetalles();
        }
        else
        {
            await DisplayAlert("Error", "No se pudo actualizar la cantidad", "OK");
        }
    }

    private async void AumentarCantidad(object sender, EventArgs e)
    {
        var button = (Button)sender;
        var detalle = (CarritoDetalle)button.BindingContext;
        int nuevaCantidad = detalle.Cantidad + 1;

       

        var response = await _productosServicio.ActualizarCantidadProductoCarrito(detalle.IdDetalle, nuevaCantidad);
        if (response != null)
        {
            await LoadDetalles();
        }
        else
        {
            await DisplayAlert("Error", "No se pudo actualizar la cantidad", "OK");
        }
    }

    private async void EliminarProducto(object sender, EventArgs e)
    {
        var button = (Button)sender;
        var detalle = (CarritoDetalle)button.BindingContext;

        var response = await _productosServicio.EliminarProductoCarrito(detalle.IdDetalle);
        if (response != null)
        {
            await LoadDetalles();
        }
        else
        {
            await DisplayAlert("Error", "No se pudo eliminar el producto", "OK");
        }

    }

    private async void ProcederOrden_Clicked(object sender, EventArgs e)
    {
        if (ProductosCarrito.Count == 0)
        {
            await DisplayAlert("Aviso", "Tu carrito está vacío", "OK");
            return;
        }

        await Navigation.PushAsync(new OrdenView(ProductosCarrito));
    }
}