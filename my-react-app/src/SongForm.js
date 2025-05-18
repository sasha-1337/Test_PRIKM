import React, { useState, useEffect } from "react";
import styles from './styles/SongForm.module.css'

function SongForm({ onClose, onSave, editSong, selectedSong }) {
    const [songName, setName] = useState(selectedSong?.name || '');
    const [songLyrics, setLyrics] = useState(selectedSong?.lyrics || '');

    useEffect(() => { 
        if (selectedSong) {
            setName(selectedSong.name);
            setLyrics(selectedSong.lyrics);
        }
    }, [selectedSong]);

    const handleSave = (e) => {
        e.preventDefault();
        if (!songName.trim()) {
            alert("Введіть назву пісні");
            return;
        }

        const newSong = {
            id: selectedSong ? selectedSong.id : Date.now(),
            name: songName,
            lyrics: songLyrics
        };

        if (selectedSong) {
            editSong(newSong);
        } else {
            onSave(newSong);
        }
        onClose();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "lyrics":
                setLyrics(value);
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSave} className={styles.form}>
                    <h3>Додати Пісню</h3>
                    <input
                        name="name"
                        type="text"
                        placeholder="Назва пісні"
                        value={songName}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <textarea
                        name="lyrics"
                        placeholder="Текст пісні"
                        value={songLyrics}
                        onChange={handleChange}
                        className={`${styles.input} ${styles.textarea}`}
                        required
                    />
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose} className={styles.button}>
                            Скасувати
                        </button>
                        <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
                            {selectedSong !== null ? "Оновити" : "Зберегти"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SongForm;
