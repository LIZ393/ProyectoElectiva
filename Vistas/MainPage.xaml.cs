using System.Collections.ObjectModel;
using SagradoAbadAPP.Modelos;
using SagradoAbadAPP.Servicios;

namespace SagradoAbadAPP.Vistas;

public partial class MainPage : ContentPage
{
    public ObservableCollection<Producto> Productos { get; set; }
    private readonly ProductosServicio _productosServicio;
   
    private string _searchText;
    public string SearchText
    {
        get => _searchText;
        set
        {
            if (_searchText != value)
            {
                _searchText = value;
                OnPropertyChanged();
                FilterProducts();
            }
        }
    }

    private bool _isLoading;
    public bool IsLoading
    {
        get => _isLoading;
        set { _isLoading = value; OnPropertyChanged(); }
    }

    public MainPage()
	{
		InitializeComponent();
        Productos = new ObservableCollection<Producto>();
        _productosServicio = new ProductosServicio();
        BindingContext = this;
    }

    protected async override void OnAppearing()
    {
        base.OnAppearing();
        await LoadProductos();
    }

    public async Task LoadProductos()
    {
        IsLoading = true;
        var productosApi = await _productosServicio.GetProductos();
        Productos.Clear();
        foreach (var producto in productosApi)
        {
            Productos.Add(producto);
        }
        IsLoading = false;
    }

    private void FilterProducts()
    {
        if (Productos == null) return;

        var filtered = string.IsNullOrWhiteSpace(SearchText)
            ? Productos.ToList()
            : Productos.Where(p =>
                p.NombreProducto.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.Descripcion.Contains(SearchText, StringComparison.OrdinalIgnoreCase))
            .ToList();

        Productos = new ObservableCollection<Producto>(filtered);
    }

    private CancellationTokenSource _searchCancellationTokenSource;

    private async void OnSearchTextChanged(object sender, TextChangedEventArgs e)
    {
        SearchText = e.NewTextValue ?? "";

        _searchCancellationTokenSource?.Cancel();
        _searchCancellationTokenSource = new CancellationTokenSource();

        try
        {
            
            await Task.Delay(300, _searchCancellationTokenSource.Token);

           
            MainThread.BeginInvokeOnMainThread(() =>
            {
                FilterProducts();
            });
        }
        catch (TaskCanceledException)
        {
           
        }
    }
    private async void OnProductSelected(object sender, SelectionChangedEventArgs e)
    {
        if (e.CurrentSelection.FirstOrDefault() is Producto selectedProduct)
        {
            // Deseleccionar inmediatamente para efecto visual
            ((CollectionView)sender).SelectedItem = null;

            // Navegar a página de detalles del producto
            //await Navigation.PushAsync(new ProductDetailPage(selectedProduct));
        }
    }

    private async void AgregarCarrito(object sender, EventArgs e)
    {
        var button = (Button)sender;
        var producto = (Producto)button.BindingContext;
        var carritoDetalle = new AgregarCarritoDetalle
        {
            CarritoId = "4c0c1a6f-1e69-424a-9b6f-a2938a054d5c",
            ProductoId = producto.Id,
         
        };

        var response = await _productosServicio.AddProductoToCarrito(carritoDetalle);
        if (response != null)
        {
            await DisplayAlert("Éxito", "Producto agregado al carrito", "OK");
        }
        else
        {
            await DisplayAlert("Error", "No se pudo agregar el producto al carrito", "OK");
        }
    }
}