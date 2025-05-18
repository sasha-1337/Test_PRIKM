﻿import React, { useState, useEffect } from 'react';
import ImageHandler from "./ImageHandler";
import styles from './styles/AlbumForm.module.css';

const AlbumForm = ({ onClose, onSave, editAlbum, selectedAlbum }) => {
    const [albumName, setAlbumName] = useState(selectedAlbum?.name || '');
    const [albumDescription, setAlbumDescription] = useState(selectedAlbum?.description || '');
    const [albumCoverImage, setAlbumCoverImage] = useState(selectedAlbum?.coverImage || "");
    const [isImageFormOpen, setImageFormOpen] = useState(false);

    useEffect(() => {
        if (selectedAlbum) {
            setAlbumName(selectedAlbum.name);
            setAlbumDescription(selectedAlbum.description);
            setAlbumCoverImage(selectedAlbum.coverImage);
        }
    }, [selectedAlbum]);

    const addImage = (image) => {
        setAlbumCoverImage(image);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!albumName.trim()) {
            alert("Введіть назву альбому");
            return;
        }

        const newAlbum = {
            id: selectedAlbum ? selectedAlbum?.id : Date.now(),
            name: albumName,
            description: albumDescription,
            songs: selectedAlbum ? selectedAlbum.songs : [],
            coverImage: albumCoverImage
        };

        if (selectedAlbum) {
            editAlbum(newAlbum);
        } else {
            onSave(newAlbum);
        }
        onClose();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "name":
                setAlbumName(value);
                break;
            case "description":
                setAlbumDescription(value);
                break;
            case "cover-image":
                setAlbumCoverImage(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2>Додати новий альбом</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Назва альбому"
                        className={styles.input}
                        value={albumName}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Опис альбому"
                        className={`${styles.input} ${styles.textarea}`}
                        value={albumDescription}
                        onChange={handleChange}
                    />
                    <p>{albumCoverImage.name}</p>
                    {albumCoverImage && (
                        <img
                            alt="Crop"
                            style={{ maxWidth: "100%", border: "2px solid black" }}
                            src={albumCoverImage.preview}
                        />
                    )}
                    <div
                        name="cover-image"
                        className={styles.button}
                        onClick={() => setImageFormOpen(true)}
                    >
                        Додати обкладинку
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.button}>
                            Скасувати
                        </button>
                        <button type="submit" className={styles.saveButton}>
                            {selectedAlbum !== null ? "Оновити" : "Зберегти"}
                        </button>
                    </div>
                </form>
            </div>
            {isImageFormOpen && (
                <ImageHandler
                    onClose={() => setImageFormOpen(false)}
                    onSave={addImage}
                />
            )}
        </div>

    );
};

export default AlbumForm;

/*
import React, { useState } from 'react';
import ImageHandler from "./ImageHandler"
import "./styles/AlbumForm.css"

const AlbumForm = ({ onClose, onSave, editAlbum, selectedAlbum }) => {
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [albumCoverImage, setAlbumCoverImage] = useState("");
    const [isImageFormOpen, setImageFormOpen] = useState(false);

    const addImage = (image) => {
        setAlbumCoverImage(image);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (albumName.trim()) {
            onSave({
                name: albumName,
                description: albumDescription,
                coverImage: albumCoverImage
            });
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleSubmit} className="form">
                    <h2>Додати новий альбом</h2>
                    <input
                        type="text"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                        placeholder="Назва альбому"
                        className="input"
                        required
                    />
                    <textarea
                        value={albumDescription}
                        onChange={(e) => setAlbumDescription(e.target.value)}
                        placeholder="Опис альбому"
                        className="input textarea"
                    />
                    <div
                        className="button"
                        onClick={() => setImageFormOpen(true)}
                    >
                        Додати обкладинку
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={onClose} className="button">
                            Скасувати
                        </button>
                        <button type="submit" className="save-button">
                            Зберегти
                        </button>
                    </div>
                </form>
            </div>
            {isImageFormOpen && (
                <ImageHandler
                    onClose={() => setImageFormOpen(false)}
                    onSave={addImage}
                />
            )}
        </div>

    );
};

export default AlbumForm;
*/