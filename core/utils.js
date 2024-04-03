export const emailValidator = email => {
    const re = /\S+@\S+\.\S+/; //re est un regex : \s = caractère, + = concaténation, etc.
    if(!email || email.length <= 0) return true;
    if(!re.test(email))return true;
    return false;
    //utilisation de regex :
    // let regex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    // return regex.test(email)
};

export const nameValidator = name => {
    if(!name || name.length <= 0) return true;

    return false;
}

export const firstnameValidator = firstname => {
    if(!firstname || firstname.length <= 0) return true;

    return false;
}