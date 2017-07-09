// this returns true a false
var signUpForm = $('.formPlugin');

var form = signUpForm.formValidate(
    [
        'firstname', 
        'lastname', 
        'password', 
        'email',
        'textarea',
        {name: 'phone',  display__invalid_msg: true},
        'dropdown',
        {
            name: 'checkbox',
            display__invalid_icon: true,
            display__valid_icon: true
        }
    ]
);

signUpForm.submit(function(e){
    e.preventDefault();
    var invalidForm = form.validateOnSubmit(form.formAssets);

    if (invalidForm) {
        console.log('dont submit');
        return false;
    }
    console.log('submit with Ajax');
})



// var firstname = $('.firstname');

// function findNearest (element, klass){
//     console.log('next is ',(element.nextAll('input.' + klass).length));
//     return element.nextAll('input.' + klass);
// }
// findNearest(firstname, 'password');