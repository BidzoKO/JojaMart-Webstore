import * as functionLibrary from "./functionLibrary.js";

export async function UserLogIn() {
  const userCredentials = functionLibrary.CheckLoginCredentials();

  if (userCredentials == null) {
    return console.log("login credentials invalid");
  }

  fetch("https://localhost:7177/User/UserLogin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: userCredentials.email,
      password: userCredentials.password,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("fetch result valid");
      } else {
        console.log("fetch result error");
        document.getElementById("signin-error-text").innerHTML = "wrong email or password";
      }
      return res.json();
    })
    .then((data) => {
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);
      functionLibrary.LoginFormConifg("disable");
      functionLibrary.ConfigureIndexUIForAuth(true);
      document.getElementById("registration-form-container").innerHTML =
        "<!--registration html-->";
    })
    .catch((error) => console.log(error));
}

export async function GetUserById() {
  const userId = 12;
  const apiEndpoint = `https://localhost:7177/User/GetuserById?Id=${userId}`;

  let apiOptions = {
    method: "GET",
  };
  try {
    const data = await functionLibrary.MakeAuthenticatedAPICall(
      apiEndpoint,
      apiOptions
    );
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

export function CreateNewUser() {
  const userObject = functionLibrary.assembleUserForCreation();

  if (userObject == null) {
    return;
  }

  fetch("https://localhost:7177/User/CreateNewUser", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userObject),
  })
    .then((res) => {
      if (res.ok) {
        
      } else {
        throw new Error("fetch result error");
      }
      return res.json();
    })
    .then((data) => {
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);
      functionLibrary.ConfigureIndexUIForAuth(true);
      document.getElementById("registration-form-container").innerHTML =
        "<!--registration html-->";
    })
    .catch((error) => console.log(error));
}

export async function ReauthenticateUser() {
  const refreshToken = Cookies.get("refreshToken");

  if (refreshToken == null) {
    return {
      message: "refresh token missing, not logged in",
      statusCode: 401,
    };
  }

  try {
    const response = await fetch("https://localhost:7177/User/RefreshJwt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        stringValue: refreshToken,
      }),
    });

    if (response.ok) {
      console.log("RefreshJwt result ok");

      const data = await response.json();
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);

      return data.accessToken; // Return the access token
    } else if (response.status === 400) {
      console.log("Likely the refresh token is expired :(");
      throw new Error("Refresh token expired");
    } else {
      console.log("RefreshJwt result error");
      throw new Error("RefreshJwt result error");
    }
  } catch (error) {
    console.error("Error with data:", error);
    throw error; // Rethrow the error for further handling
  }
}

export async function UserLogout() {
  const apiEndpoint = "https://localhost:7177/User/Logout";

  let apiOptions = {
    method: "DELETE",
  };

  const data = await functionLibrary.MakeAuthenticatedAPICall(
    apiEndpoint,
    apiOptions
  );

  if (data) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    window.location.assign("/index.html");

    functionLibrary.ConfigureIndexUIForAuth(false);
  }
}

export async function GetCartItems() {
  const apiEndpoint = "https://localhost:7177/Order/GetCartItems";

  const apiOptions = {
    method: "GET",
  };

  try {
    const data = await functionLibrary.MakeAuthenticatedAPICall(
      apiEndpoint,
      apiOptions
    );

    if (data == 204) {
      return null;
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function DeleteCartItem(itemId) {
  const apiEndpoint = "https://localhost:7177/Order/DeleteCartItem";

  const apiOptions = {
    method: "DELETE",
    body: JSON.stringify({
      intValue: itemId,
    }),
  };

  const response = await functionLibrary.MakeAuthenticatedAPICall(
    apiEndpoint,
    apiOptions
  );

  try {
    if (response.status === 200) {
      return "Success";
    } else {
      throw new Error(
        "Unexpected response from the MakeAuthenticatedAPICall API while deleting cart item"
      );
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function OrderCartItems() {
  const apiEndpoint = "https://localhost:7177/Order/OrderProducts";

  const apiOptions = {
    method: "POST",
  };

  const response = await functionLibrary.MakeAuthenticatedAPICall(
    apiEndpoint,
    apiOptions
  );

  try {
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(
        "Unexpected response from the MakeAuthenticatedAPICall API while purchasing products"
      );
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function UpdateUserDetails(userDetails){
  const apiEndpoint = "https://localhost:7177/Order/OrderProducts";

  const apiOptions = {
    method: "POST",
    body: 
      JSON.stringify(userDetails)
  };

  const response = await functionLibrary.MakeAuthenticatedAPICall(
    apiEndpoint,
    apiOptions
  );
}

//#region static info

export async function GetLimitedTimeItems() {
  const response = await fetch(
    "https://localhost:7177/Product/getLimitedTimeItems",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );

  const productList = await response.json();

  functionLibrary.InsertLimitedItems(productList);

  functionLibrary.EnableLimitedOffersScroll();
}

export async function GetPopularItems() {
  const response = await fetch(
    "https://localhost:7177/Product/getPopularItems",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );

  const productList = await response.json();

  functionLibrary.InsertPopularItem(productList);
}

export async function GetProductByName(product) {
  const response = await fetch(
    "https://localhost:7177/Product/getProductByName",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(product),
    }
  );

  const productItem = await response.json();

  return productItem;
}

export async function GetUserIdentity() {
  const apiEndpoint = "https://localhost:7177/User/GetUserInfo";

  let apiOptions = {
    method: "POST",
  };

  try {
    const data = await functionLibrary.MakeAuthenticatedAPICall(
      apiEndpoint,
      apiOptions
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

//#endregion static info
