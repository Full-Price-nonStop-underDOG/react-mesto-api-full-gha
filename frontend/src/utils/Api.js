import { elementsApi } from "./constants";

class Api {
  constructor({ headers, URL }) {
    this._headers = headers;
    this._url = URL;
  }

  _handlePromiseRequest(res) {
    if (res.ok) {
      return res.json();
    } else throw new Error("ошибка");
  }
  async addLike(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
    return this._handlePromiseRequest(response);
  }

  async removeLike(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });

    return this._handlePromiseRequest(response);
  }

  async getUserInfo() {
    const reply = await fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: this._headers,
    });
    return this._handlePromiseRequest(reply);
  }

  async getInitialCardsData() {
    const reply = await fetch(`${this._url}/cards`, {
      headers: this._headers,
    });
    return this._handlePromiseRequest(reply);
  }

  getInitialData() {
    return Promise.all([this.getInitialCardsData(), this.getUserInfo()]);
  }

  async editProfileInfo(data) {
    console.log(data);
    const response = await fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,

      body: JSON.stringify({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
      }),
    });

    return this._handlePromiseRequest(response);
  }

  async removeCard(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
    return this._handlePromiseRequest(response);
  }

  async addNewCard(data) {
    const response = await fetch(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,

      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
    return this._handlePromiseRequest(response);
  }

  async getCard(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}`, {
      method: "GET",
      headers: this._headers,
    });
    return this._handlePromiseRequest(response);
  }

  async updateProfileUserAvatar(data) {
    const response = await fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
    return this._handlePromiseRequest(response);
  }
}
const api = new Api(elementsApi);
export default api;
