import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FiMapPin } from 'react-icons/fi';
import './Component.css';
import './Mediaquery.css'
import API from '../Services/API.jsx';

function Component() {
    const [input, setInput] = useState('');
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);

    async function handleChangeSearch() {
        const cep = input.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        if (cep.length !== 8) {
            setContent(null);
            setError({ message: 'Digite um CEP válido' });
            return;
        }

        try {
            const response = await API.get(`${cep}/json`);
            if (response.data.erro) {
                setError({ message: 'CEP não encontrado' });
                setContent(null);
            } else {
                setError(null);
                setContent(response.data);
            }
            setInput('');
        } catch (error) {
            console.error(error);
            setError({ message: 'Erro ao buscar dados!' });
            setContent(null);
            setInput('');
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            handleChangeSearch();
        }
    }

    const handleGoogleMapsLink = () => {
        if (!content) return;
        const { logradouro, bairro, localidade, uf } = content;
        const addressQuery = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <>
            <div className="container">
                <h1>Buscador de CEP</h1>
                <div className='controls'>
                    <input
                        type="text"
                        placeholder='Digite o CEP'
                        autoComplete='no'
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleChangeSearch}><FiSearch size={25} color='white' /></button>
                </div>

                {error && (
                    <div className="content">
                        <p>{error.message}</p>
                    </div>
                )}

                {content && (
                    <div className="content">
                        <h2>CEP: {content.cep}</h2>
                        <span>{content.logradouro}</span>
                        <span>Bairro: {content.bairro}</span>
                        <span>{content.localidade} - {content.uf}</span>
                        <span className='lightblue' onClick={handleGoogleMapsLink}> <FiMapPin size={25} color='white' className='iconBlue'/> <p>Visualizar no Google Maps</p></span>
                    </div>
                )}
            </div>
        </>
    );
}

export default Component;