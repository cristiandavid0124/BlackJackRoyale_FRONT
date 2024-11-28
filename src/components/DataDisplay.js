import React, { useEffect, useState } from 'react';
import { getNameAndUsername } from '../utils/claimUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Data.css';
import popeye from './img/popeye.png';
import chili from './img/chili.png';
import pablo from './img/pablo.png';
import logo from './img/logoo.png'; // Importa el logo
import BotonAuth from './BotonAuth'; // Botón de autenticación
import { useUser } from './UserContext';

export const IdTokenData = (props) => {
  const { name, preferred_username } = getNameAndUsername(props.idTokenClaims);
  const navigate = useNavigate();
  const { setUserId, setUserName, setLoadingUser } = useUser();

  const [nickname, setNickname] = useState('Player123');
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    const initializeUser = async () => {
      setUserId(preferred_username);

      try {
        const response = await axios.get(
          `http://localhost:8080/users/${preferred_username}`
        );
        console.log('Datos recibidos del backend:', response.data);

        if (response.status === 200) {
          const { nickName = '', amount = 0 } = response.data;
          setNickname(nickName || 'Player123');
          setSaldo(amount);
          setNicknameSaved(!!nickName);
          if (nickName) {
            setUserName(nickName);
          }
        }
      } catch (error) {
        console.error('Error verificando el usuario:', error);
        if (error.response && error.response.status === 404) {
          try {
            await axios.post(
              'http://localhost:8080/users',
              {
                email: preferred_username,
                name: name,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            setNicknameSaved(false);
          } catch (postError) {
            console.error('Error al crear el usuario:', postError);
          }
        }
      } finally {
        setLoadingUser(false);
      }
    };

    initializeUser();
  }, [preferred_username, name, setUserId, setUserName, setLoadingUser]);

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameSaved(false);
    setNicknameError(
      value.length < 3 ? 'El Nickname debe tener al menos 3 caracteres' : ''
    );
  };

  const handleSaveNickname = async () => {
    if (nickname.length < 3) {
      setNicknameError('El Nickname debe tener al menos 3 caracteres');
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/users/${preferred_username}`,
        { nickName: nickname },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNicknameSaved(true);
      setUserName(nickname);
    } catch (putError) {
      console.error('Error al actualizar el nickname:', putError);
    }
  };

  const handlePlayClick = () => {
    if (!nicknameSaved) {
      setErrorMessage('Tienes que crear tu NickName antes de jugar');
    } else {
      navigate('/BlackJackRoyale/SelectTable');
    }
  };

  const developers = [
    { img: popeye, name: 'Diego "Popeye"' },
    { img: pablo, name: 'Daniel "Pablito"' },
    { img: chili, name: 'Cristian "Chili"' }
    ,
  ];

  return (
    <>
      {/* Header */}
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info-right">
          <BotonAuth />
        </div>
      </header>

      <div className="main-container1">
        {/* Contenido principal */}
        <div className="main-content2">
          <div className="user-grid">
            <h2>👤 Player Info</h2>
            <div className="label">Name:</div>
            <div className="value">{name}</div>
            <div className="label">Email:</div>
            <div className="value">{preferred_username}</div>
            <div className="label">Saldo:</div>
            <div className="value">${saldo.toFixed(2)}</div>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="nickname-input"
              placeholder="Enter your nickname"
              disabled={nicknameSaved}
            />
            {nicknameError && <p className="error-message">{nicknameError}</p>}
            <div className="actions">
              {!nicknameSaved && (
                <button
                  onClick={handleSaveNickname}
                  className="save-button"
                  disabled={nickname.length < 3}
                >
                  Save
                </button>
              )}
              <button
                onClick={handlePlayClick}
                className="play-button"
                disabled={!nicknameSaved}
              >
                Jugar
              </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>

        {/* Footer de desarrolladores */}
        <div className="footer">
          <div className="footer-left">
            <h2>Squad el Patrón del Mal</h2>
          </div>
          <div className="footer-right">
            <div className="developer-cards">
              {developers.map((dev, index) => (
                <div className="card" key={index}>
                  <img src={dev.img} alt={dev.name} className="card-image" />
                  <p className="card-name">{dev.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdTokenData;
