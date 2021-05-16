# node-rest-shop
A Restful API Project for handling products and orders with authentication routes
$ Summary of This RestFull API Service..

#1 Working of All Routes-->

? PRODUCT ROUTE: 

- GET @localhost:8000/products/
  Return the list of All the products.

- POST @localhost:8000/products/ (AUTH REQUIRED)
  To Add new Products send the data in formData format because it also contains a file.
  fields of the formData should be: 
  name: product_name
  price: product_price
  productImage: image_file
  + FOR AUTH Provide the token in the authorization header as bearer Token.
  note: do not forgot to use header application/form-data
 
- GET @localhost:8000/products/:productId
  Provide product id in the params to get the details of the particular product with that productID

- PATCH @localhost:8000/products/:productId (AUTH REQUIRED)
  To Update the product you need to provide an array with each object containing the property name which you want to update and the new value to be set.
  [
      {
          "propName": "name_of_the_property",
          "value": "new_value_to_be_set"
      }
  ]
  
- DELETE @localhost:8000/products/:productId (AUTH REQUIRED)
  TO delete the product simple provide the productId in the params.

? ORDERS ROUTE:
