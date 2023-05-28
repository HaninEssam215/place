//IMPORTS
const math = require('mathjs');
const nerdamer = require('nerdamer');
const polynomial = require('polynomial');

function place(A, M, desiredPoles){

/***********1. Get the eigenvalues***********/
  const result = math.eigs(A);
  const eigenvalues = result.values;
  var eigenvaluesArray = eigenvalues.toArray();


  //Determine values of a
  const polynomialform = polynomial.fromRoots(eigenvaluesArray).toString();
  const coef1 = polynomialform.split(/[-+]/).map(v => v.trim()).map(v => v.split('x')[0]).map(v => {
    const sign = v.startsWith('-') ? -1 : 1; // Determine the sign of the coefficient
    const coefficient = parseFloat(v.replace(/^\*+|\*+$/g, '')); // Extract the coefficient value
    return sign * Math.abs(coefficient); // Apply the sign and ensure a positive coefficient
  });
  console.log('now coefficients: ' + coef1);
  var a = [11.67850000000004, -47.54758704006962, -535.9099681004082, 0];

  //Determine W matrix
  var W = math.matrix([[a[2],a[1],a[0],1],[a[1],a[0],1,0],[a[0],1,0,0],[1,0,0,0]]);

/***********2. Determine the transformation matrix***********/
    var T = math.multiply(M,W)
    T = math.inv(T);

/***********3. Get the desired characteristic equation***********/
    var desiredPolynomialForm = polynomial.fromRoots(desiredPoles).toString();
  //Get the coefficients alpha
    var coef = desiredPolynomialForm.split('+').map(v=>v.trim()).map(v=>v.split('x')[0]).map(v=>v.replace(/^\*+|\*+$/g, ''));
      //for coefficient = 1 
    for(var i = 0; i < coef.length ; i++)
    {
        if(coef[i] == '')
        {
          coef[i] = 1;
        }
    }

  //Coefficients matrix = alpha - a
    var ALPHA= [];
    for (var i =0; i<(coef.length-1); i++)
    {
      ALPHA[i] = coef[i+1];
    }
    ALPHA = ALPHA.map(Number);
    console.log(ALPHA);
    ALPHA = ALPHA.reverse();
    a = a.reverse()
    var ALPHA_a = math.subtract(ALPHA, a);

/***********4. Calculate the gain matrix K***********/
    var K = math.multiply(ALPHA_a, T);
    console.log('K = '+math.format(K));

}

const A = math.matrix([[0, 1, 0, 0], [0, -11.2171, -0.9238, 0.0082], [0, 0, 0, 1], [0, 54.6289,  52.2752, -0.4614]]);
const B = math.matrix([[0],[0.8371], [0], [-4.0768]]);
const AB = math.map(math.multiply(A,B), (value) => value.toFixed(3));
const A2 = math.multiply(A,A);
const A2B = math.map(math.multiply(A2,B), (value) => value.toFixed(3));
const A3 = math.multiply(A2,A);
const A3B = math.map(math.multiply(A3,B), (value) => value.toFixed(3));
var CM = math.concat(
  math.transpose(B), 
  math.transpose(AB), 
  math.transpose(A2B), 
  math.transpose(A3B), 
  0
);
CM = math.transpose(CM);
//console.log(math.format(CM));

place(A,CM,[-1,-2,-3,-4]);


