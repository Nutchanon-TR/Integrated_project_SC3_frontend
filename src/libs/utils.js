function unitPrice(price) {
     try {
          return price.toLocaleString();
     } catch (error) {
          return "error"
     }
 }

 export { unitPrice };