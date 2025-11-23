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
    public class CarritoDetalle
    {
     
        public string IdDetalle { get; set; } 

        public string CarritoId { get; set; }
   

        [ForeignKey("Producto")]
        public string ProductoId { get; set; }

        public Producto Producto { get; set; }

        public int Cantidad { get; set; }
    }
}
