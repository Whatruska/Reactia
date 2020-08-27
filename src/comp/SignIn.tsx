import React, { SyntheticEvent, useState } from 'react';
import firebase from 'firebase';
import { NavLink } from 'react-router-dom';

const SignIn = () => {
  const [confirmRes, setConfirmRes] = useState(JSON.parse(window.localStorage.getItem('confirm') as string));
  const phoneRef = React.createRef<any>();
  const codeRef = React.createRef<any>();
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha-container', {
    size: 'invisible',
  });
  const signIn = (e:SyntheticEvent) => {
    e.preventDefault();
    if (!confirmRes) {
      firebase.auth().signInWithPhoneNumber(phoneRef.current.value, recaptchaVerifier)
        .then((confirmationResult) => {
          window.localStorage.setItem('confirm', JSON.stringify(confirmationResult));
          setConfirmRes(confirmationResult);
          alert('Check your phone');
        }).catch((error) => {
          alert(error);
        });
    } else {
      const code = codeRef.current.value;
      confirmRes.confirm(code).then((result:any) => {
        const { user } = result;
        window.localStorage.removeItem('confirm');
        alert(JSON.stringify(user));
      }).catch((error:any) => {
        alert(error);
      });
    }
  };
  return (
    <form>
      Sign in
      <input type="tel" required ref={phoneRef} autoComplete="true" />
      <input type="number" hidden={!confirmRes} required ref={codeRef} autoComplete="true" />
      <button type="submit" onClick={signIn}>
        Submit
      </button>
      <NavLink to="/signUp">Register</NavLink>
    </form>
  );
};

export default SignIn;
