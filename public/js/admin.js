/** This code will run on the client side in the browser */

const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value; 
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value; 

  /** Find the article based on the button */
  const productElement = btn.closest('article')

  /** Send data to the backend through js client code */
  fetch('/admin/product/' + prodId, {
    // Define a delete request 
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  }).then(result => {
    return result.json(); 
  })
  .then(data => {
    console.log(data); 
    productElement.parentNode.removeChild(productElement); 
  })
  .catch(err => {
    console.log(err);
  })
}; 