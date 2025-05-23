import React, { useState, useEffect } from 'react';
import styles from './styles/ShowText.module.css';
import VinylPlayer from './VinylPlayer';

function ShowText({ selectedSingle, selectedAlbum, selectedSong }) {
    const [singleName] = useState(selectedSingle?.name || '');
    const [singleLyrics] = useState(selectedSingle?.lyrics || '');
    const [singleDescription] = useState(selectedSingle?.description || '');
    const [singleCoverImage] = useState(selectedSingle?.coverImage || '');

    const [albumName] = useState(selectedAlbum?.name || '');
    const [albumDescription] = useState(selectedAlbum?.description || '');
    const [albumCoverImage] = useState(selectedAlbum?.coverImage || "");

    const [songName] = useState(selectedSong?.name || '');
    const [songLyrics] = useState(selectedSong?.lyrics || '');

    const formatText = (text) => {
        return text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className={styles.commonContainer}>
            {/* Lyrics Square */}
            <div className={styles.lyricsContainer}>
                {selectedSingle && (
                    <div className={styles.lyrics}>
                        <div className={styles.scrollContent}>
                            <h3 style={{ marginBottom: '10px' }}>{singleName}</h3>
                            <div>
                                {formatText(singleLyrics)}
                            </div>
                        </div>
                    </div>
                )}

                {selectedSong && (
                    <div className={styles.lyrics}>
                        <div className={styles.scrollContent}>
                            <h3 style={{ marginBottom: '10px' }}>{songName}</h3>
                            <div>
                                {formatText(songLyrics)}
                            </div>

                        </div>
                    </div>
                )}

                {!selectedSingle && !selectedSong && (
                    <div className={styles.scrollContent}>
                        <div className={styles.lyrics}>

                            {formatText("Тут може бути текст вашого синглу або пісні")}
                            {formatText(
                                `Опис альбому або додаткові відомості`)}
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.descriptionVynilContainer}>
                {/* Description Square */}
                {/*<VinylPlayer selectedAlbum={selectedAlbum}></VinylPlayer>*/}
                <div className={styles.descriptionContainer}>
                    {selectedSingle && (
                        <div className={styles.description}>
                            <div className={styles.scrollContent}>
                                <h3 style={{ marginBottom: '15px' }}>Опис</h3>
                                <div>
                                    {formatText(singleDescription) || 'Опис синглу або додаткові відомості'}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedAlbum && (
                        <div className={styles.description}>
                            <div className={styles.scrollContent}>
                                <h3 style={{ marginBottom: '15px' }}>Опис альбому</h3>
                                <div>
                                    {formatText(albumDescription) || 'Додаткові відомості про альбом'}
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedSingle && !selectedAlbum && !selectedSong && (
                        <div className={styles.scrollContent}>
                            <div className={styles.description}>

                                <h3 style={{ marginBottom: '5px' }}>Опис</h3>
                                {formatText(
                                    `Опис альбому або додаткові відомості`)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ShowText;