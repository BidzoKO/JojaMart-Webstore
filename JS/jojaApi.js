import * as functionLibrary from './functionLibrary.js';

// user signin POST method
export async function UserLogIn() {
  const userEmail = document.querySelector("#login-email");
  const userPassword = document.querySelector("#login-password");

  fetch("https://localhost:7177/User/UserLogin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail.value,
      password: userPassword.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("fetch result valid");
      } else {
        console.log("fetch result error");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);
      functionLibrary.enableScroll();
      functionLibrary.configureUIForAuth(true);
      document.getElementById("registration-form-container").innerHTML =
        "<!--registration html-->";
    })
    .catch((error) => console.log("Error widh data"));
}

// only for testing needs changing
export async function GetUserById() {
  const userId = 10;
  const apiEndpoint = `https://localhost:7177/User/GetuserById?Id=${userId}`;

  let apiOptions = {
    method: "GET",
  };
  try {
    const data = await functionLibrary.MakeAuthenticatedAPICall(apiEndpoint, apiOptions);
    console.log(data);
  } catch (error) {
    console.error(error)
  }
}

// creates a new user by signing up
export function CreateNewUser() {
  const userObject = functionLibrary.assembleUserForCreation();

  if (userObject == null) {
    return console.log("signup user object incomplete");
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
        console.log("fetch result valid");
      } else {
        throw new Error("fetch result error");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);
      functionLibrary.configureUIForAuth(true);
      document.getElementById("registration-form-container").innerHTML =
        "<!--registration html-->";
    })
    .catch((error) => console.log(error));
}

// user reauthentication api call for when access token is
export async function ReauthenticateUser() {
  const refreshToken = Cookies.get("refreshToken");

  try {
    const response = await fetch("https://localhost:7177/User/RefreshJwt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
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

// logout deletes JWTs
export async function UserLogout() {
  const apiEndpoint = "https://localhost:7177/User/Logout";

  let apiOptions = {
    method: "DELETE",
  };

  const data = await functionLibrary.MakeAuthenticatedAPICall(apiEndpoint, apiOptions);

  if (data) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    functionLibrary.configureUIForAuth(false);
  }
}

// ----------------------------------
// static information section

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

  for (let i = 0; i < 8; i++) {
    functionLibrary.InsertPopularItem(productList[i]);
  }
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

  console.log(productItem);

  return productItem;
}
