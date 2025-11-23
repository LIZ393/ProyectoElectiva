using System.Net.Http.Json;
using System.Text.Json;

using SagradoAbadAPP.Modelos;

namespace SagradoAbadAPP.Servicios;

public class ProductosServicio
{
    private readonly HttpClient _httpClient;
    private string BaseUrl = "https://b47c-2800-e2-407f-f855-b98d-2e1-e852-6203.ngrok-free.app";

    public ProductosServicio()
    {
        _httpClient = new HttpClient();
       
    }

    public async Task<Orden> CrearOrden(NuevaOrden ordenData)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"{BaseUrl}/api/orden", ordenData);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Orden>(json);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al crear orden", ex);
        }
    }

    public async Task<string> EliminarProductoCarrito(string detalleId)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"{BaseUrl}/api/carrito/{detalleId}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al eliminar producto del carrito", ex);
        }
    }

    public async Task<string> ActualizarCantidadProductoCarrito(string detalleId, int cantidadNueva)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync($"{BaseUrl}/api/carrito/{detalleId}", cantidadNueva);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        } catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al actualizar cantidad del producto al carrito", ex);
        }
    }
    public async Task<string> AddProductoToCarrito(AgregarCarritoDetalle data)
    {
        try
        {
            
            var response = await _httpClient.PostAsJsonAsync($"{BaseUrl}/api/carrito/addProducto", data);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();  
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al agregar el producto al carrito", ex);

        }
    }
   

    public async Task<Carrito> getCurrentUserCarrito(string userId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{BaseUrl}/api/carrito/{userId}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
                
            return JsonSerializer.Deserialize<Carrito>(json, options);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al obtener el carrito del usuario", ex);
        }
    }

    public async Task<IEnumerable<Producto>> GetProductos()
    {
        try
        {
            var response = await _httpClient.GetAsync($"{BaseUrl}/api/productos");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return  JsonSerializer.Deserialize<IEnumerable<Producto>>(json, options);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw new Exception("Error al obtener los productos", ex);
        }
    }
}