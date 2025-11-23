using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SagradoAbadAPP.Modelos
{
    public class Producto
    {
      
        public string Id { get; set; } 

       
        public string NombreProducto { get; set; }

        public string Descripcion { get; set; }

 
        public decimal Precio { get; set; }


        public Categoria Categoria { get; set; }

        public string ImagenPrincipal { get; set; }

     
    }
}
