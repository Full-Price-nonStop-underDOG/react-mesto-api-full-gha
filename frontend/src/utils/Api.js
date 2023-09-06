import { authenticationElemenetsApi } from './constants';

class Api {
  constructor({ headers, URL }) {
    this._headers = headers;
    this._url = URL;
  }

  _handlePromiseRequest(res) {
    if (res.ok) {
      return res.json();
    } else throw new Error('ошибка');
  }
  async addLike(cardId, token) {
    const response = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    });
    return this._handlePromiseRequest(response);
  }

  async removeLike(cardId, token) {
    const response = await fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    });

    return this._handlePromiseRequest(response);
  }

  async getUserInfo(token) {
    const response = await fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    });
    return this._handlePromiseRequest(response);
  }

  async getInitialCardsData(token) {
    const response = await fetch(`${this._url}/cards`, {
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
    });
    return this._handlePromiseRequest(response);
  }

  getInitialData() {
    return Promise.all([this.getInitialCardsData(), this.getUserInfo()]);
  }

  async editProfileInfo(data, token) {
    console.log(data);
    const response = await fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },

      body: JSON.stringify({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
      }),
    });

    return this._handlePromiseRequest(response);
  }

  async removeCard(cardId, token) {
    try {
      const response = await fetch(`${this._url}/cards/${cardId}`, {
        method: 'DELETE',
        headers: { ...this._headers, Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Попробуйте распарсить JSON с информацией об ошибке
        throw new Error(errorData.message || 'Ошибка при удалении карточки');
      }

      return this._handlePromiseRequest(response);
    } catch (error) {
      throw error;
    }
  }

  async addNewCard(data, token) {
    const response = await fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },

      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
    return this._handlePromiseRequest(response);
  }

  async getCard(cardId) {
    const response = await fetch(`${this._url}/cards/${cardId}`, {
      method: 'GET',
      headers: this._headers,
    });
    return this._handlePromiseRequest(response);
  }

  async updateProfileUserAvatar(data, token) {
    const response = await fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: { ...this._headers, Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
    return this._handlePromiseRequest(response);
  }
}
const api = new Api(authenticationElemenetsApi);
export default api;
