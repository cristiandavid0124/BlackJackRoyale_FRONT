// IdTokenData.js
import React, { useEffect, useState } from 'react';
import { getNameAndUsername } from '../utils/claimUtils';
import BotonAuth from './BotonAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Data.css';
import logo from './img/logoo.png';
import { useUser } from './UserContext';

export const IdTokenData = (props) => {
  const { name, preferred_username } = getNameAndUsername(props.idTokenClaims);
  const navigate = useNavigate();
  const { setUserId, setUserName } = useUser();

  const [nickname, setNickname] = useState('Player123');
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    setUserId(preferred_username); // Establecer `userId` en el contexto

    const checkOrCreateUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${preferred_username}`);
        if (response.status === 200) {
          const nickNameFromServer = response.data.nickName || '';
          setNickname(nickNameFromServer);
          setNicknameSaved(!!nickNameFromServer);
          if (nickNameFromServer) {
            setUserName(nickNameFromServer); // Establecer `userName` en el contexto
          }
        }
      } catch (error) {
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
        } else {
          console.error('Error verificando el usuario:', error);
        }
      }
    };

    checkOrCreateUser();
  }, [preferred_username, name, setUserId, setUserName]);

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameSaved(false);

    if (value.length < 3) {
      setNicknameError('El Nickname debe tener al menos 3 caracteres');
    } else {
      setNicknameError('');
    }
  };

  const handleSaveNickname = async () => {
    if (nickname.length < 3) {
      setNicknameError('El Nickname debe tener al menos 3 caracteres');
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/users/${preferred_username}`,
        {
          nickName: nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setNicknameSaved(true);
      setUserName(nickname); // Establecer `userName` en el contexto
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

  return (
    <>
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info-right">
          <BotonAuth />
        </div>
      </header>

      <div className="user-info-container">
        <div className="user-card">
          <h2>👤 Choose Your Nickname</h2>
          <div className="user-details">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {preferred_username}
            </p>
            <p>
              <strong>Nick:</strong>
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                className="nickname-input"
                disabled={nicknameSaved}
              />
            </p>
            {nicknameError && <p className="error-message">{nicknameError}</p>}
            {!nicknameSaved && (
              <button onClick={handleSaveNickname} className="save-button" disabled={nickname.length < 3}>
                Save
              </button>
            )}
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handlePlayClick} className="play-button" disabled={!nicknameSaved}>
          Jugar
        </button>
      </div>
    </>
  );
};

export default IdTokenData;
