export function CheckFullname(fullname) {
  const regex = /^\s*(?:[a-zA-Z]{1,20})\s+(?:[a-zA-Z]{1,20})\s*$/;
  const validName = regex.test(fullname);
  if (validName) {
    const newUserFullName = fullname.split(/\s+/);

    return {
      firstName: newUserFullName[0],
      lastName: newUserFullName[1],
    };
  } else {
    return false;
  }
}

export function CheckUsername(username) {
  const regex = /^\s*(?:[a-zA-Z0-9]{1,20})\s*$/;
  const validName = regex.test(username);
  if (validName) {
    return username.trim();
  } else {
    return false;
  }
}

export function CheckAddress(address) {
    const regex = /^\s*(?:[a-zA-Z]{1,30})\s+([0-9]{1,3})\s*$/;
    const validaddress = regex.test(address);
    if (validaddress) {
      return address.trim();
    } else {
      return false;
    }
}

export function CheckPhoneNumber(phoneNumber){
    const regex = /^\s*(?:[0-9]{1,15})\s*$/;
    const validPhoneNumber = regex.test(phoneNumber);
    if (validPhoneNumber) {
      return phoneNumber.trim();
    } else {
      return false;
    }
}

export function PasswordPhoneNumber(newPass){
    const regex = /^\s*(?:[a-zA-Z0-9]{1,20})\s*$/;
    const validPass= regex.test(newPass);
    if (validPass) {
      return newPass.trim();
    } else {
      return false;
    }
}