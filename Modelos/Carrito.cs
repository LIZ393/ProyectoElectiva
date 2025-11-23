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
    public class Carrito
    {
        public string Id { get; set; } 

      
        public string UsuarioId { get; set; }
     

        public ICollection<CarritoDetalle> Detalles { get; set; }
    }
}
