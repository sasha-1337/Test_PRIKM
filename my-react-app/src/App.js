import React, { useState } from 'react';
import "./styles/App.css";
import AlbumForm from './AlbumForm';
import SongForm from './SongForm';
import SingleForm from './SingleForm';
import { RiDeleteBack2Line } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import styled, { css } from 'styled-components';


const App = () => {
    const [albums, setAlbums] = useState([]);
    const [albumFormState, setAlbumFormState] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [expandedAlbums, setExpandedAlbums] = useState(new Set());

/*    const [isSongFormOpen, setIsSongFormOpen] = useState(false);*/
    const [songFormState, setSongFormState] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);

    const [singles, setSingles] = useState([]);
    const [selectedSingle, setSelectedSingle] = useState(null);
    const [singleFormState, setSingleFormState] = useState(null);

    const [activeId, setActiveId] = useState(null);
    const [activeSongId, setActiveSongId] = useState(null);

    const [filters, setFilter] = useState('all');


    const getAllItems = () => {
        const allItems = [
            ...albums.map(album => ({ ...album, songs: album.songs || [], type: 'album' })),
            ...singles.map(single => ({ ...single, type: 'single' }))
        ].sort((a, b) => b.createdAt - a.createdAt);
        switch (filters) {
            case 'albums':
                return allItems.filter(item => item.type === 'album');
            case 'singles':
                return allItems.filter(item => item.type === 'single');
            default:
                return allItems;
        }
    };

    const addSingle = (singleData) => {
        setSingles([
            ...singles,
            {
                id: Date.now(),
                name: singleData.name,
                description: singleData.description,
                lyrics: singleData.lyrics,
                coverImage: singleData.coverImage,
                createdAt: Date.now(),
                type: 'single'
            }
        ]);
        console.log(singleData);
    };

    const addAlbum = (albumData) => {
        setAlbums([
            ...albums,
            {
                id: Date.now(),
                name: albumData.name,
                description: albumData.description,
                coverImage: albumData.coverImage,
                songs: [],
                createdAt: Date.now(),
                type: 'album'
            }
        ]);
        console.log(albumData);
    };

    const addSong = (songData) => {
        setAlbums(albums.map(album => {
            if (album.id === selectedAlbum.id) {
                return {
                    ...album,
                    songs: [...(album.songs || []), {
                        id: Date.now(),
                        name: songData.name,
                        lyrics: songData.lyrics
                    }]
                };
            }
            return album;
        }));
    };

    const editSingle = (updatedSingle) => {
        setSingles(singles.map(single =>
            single.id === updatedSingle.id ? updatedSingle : single));
        console.log(updatedSingle);
    };

    const editAlbum = (updatedAlbum) => {
        setAlbums(albums.map(album =>
            album.id === updatedAlbum.id ? updatedAlbum : album));
        console.log(updatedAlbum);
    };

    const editSong = (updatedSong) => {
        setAlbums(albums.map(album => {
            if (album.id === selectedAlbum.id) {
                return {
                    ...album,
                    songs: album.songs.map(song =>
                        song.id === updatedSong.id ? updatedSong : song
                    )
                };
            }
            return album;
        }));
    };

    const removeSingle = (singleId) => {
        setSingles(singles.filter((single) => single.id !== singleId));
    }

    const removeAlbum = (albumId) => {
        setAlbums(albums.filter(album => album.id !== albumId));
        const newExpanded = new Set(expandedAlbums);
        newExpanded.delete(albumId);
        setExpandedAlbums(newExpanded);
    };

    const removeSong = (albumId, songId) => {
        setAlbums(albums.map(album => {
            if (album.id === albumId) {
                return {
                    ...album,
                    songs: album.songs.filter(song => song.id !== songId)
                };
            }
            return album;
        }));
    };

    const toggleAlbum = (albumId) => {
        const newExpanded = new Set(expandedAlbums);

        if (expandedAlbums.has(albumId)) {
            newExpanded.delete(albumId);
            setExpandedAlbums(newExpanded);
            setActiveId(null);
        } else {
            newExpanded.add(albumId);
            setExpandedAlbums(newExpanded);
            setActiveId(albumId);
        }
        /// Інший спосіб реалізації ///
        ///
        //if (expandedAlbums.has(albumId)) {
        //    const newExpanded = new Set();
        //    setExpandedAlbums(newExpanded);
        //    setActiveId(null);
        //} else {
        //    const newExpanded = new Set([albumId]);
        //    setExpandedAlbums(newExpanded);
        //    setActiveId(albumId);
        //}c
    };

    const handleSongClick = (songId, song) => {
        setActiveSongId(activeSongId === songId ? null : songId);
        setSelectedSong(song);
    };

    const handleAddSongClick = (album) => {
        setSelectedAlbum(album);
        setSongFormState("add");
    }

    const handleSingleClick = (singleId, single) => {
        setActiveId(activeId === singleId ? null : singleId);
        setSelectedSingle(single);
    }


    return (
        <div className="container">
            <div className="button-group">
                <button
                    onClick={() => setAlbumFormState("add")}
                    className="add-button"
                >
                    Додати Альбом
                </button>
                <button
                    className="add-button"
                    onClick={() => setSingleFormState("add")}
                >
                    Додати Сингл
                </button>

                <select
                    value={filters}
                    className="select"
                    onChange={(e) => setFilter(e.target.value)}                  
                >
                    <option className="all" value="all">Усі</option>
                    <option value="albums">Альбоми</option>
                    <option value="singles">Сингли</option>
                </select>
            </div>

            <div className="content-container">
                <div className="content-scrollbar">
                    {getAllItems().map((item) => {
                        if (item.type === 'single') {
                            return (
                                <div key={item.id}
                                    className="single-container"
                                >
                                    <Header className="single-header"
                                        active={activeId === item.id ?? true}
                                        onClick={(e) => { e.stopPropagation(); handleSingleClick(item.id, item); }}>
                                        {item.coverImage.preview &&
                                            <div className="background-image"
                                                style={{ backgroundImage: `url(${item.coverImage.preview})` }} />}
                                        <div className="overlay" />
                                        <div className="content">
                                            <div className="single-info">
                                                <div className="single-name"> {item.name} </div>
                                                <div className="single-lyrics"> {/*{item.lyrics}*/} </div>
                                            </div>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-button"
                                                    onClick={(e) => { e.stopPropagation(); setSingleFormState("edit"); setSelectedSingle(item); }}
                                                >
                                                    <TbEdit className="edit-icon"/>
                                                </button>
                                                <button
                                                    className="action-button"
                                                    onClick={(e) => { e.stopPropagation(); removeSingle(item.id) }}
                                                >
                                                    <RiDeleteBack2Line className="remove-icon" />
                                                </button>
                                            </div>

                                        </div>
                                    </Header>
                                </div>
                            );
                        } if (item.type === 'album') {
                            return (
                                <div key={item.id} className="album-container">
                                    <Header className="album-header"
                                        active={activeId === item.id ?? true}
                                        onClick={() => { toggleAlbum(item.id); }}
                                    >
                                        {item.coverImage.preview &&
                                            <div className="background-image"
                                                style={{ backgroundImage: `url(${item.coverImage.preview})` }} />}
                                        <div className="overlay"/>
                                        <div className="content">
                                            <div className="album-info">

                                                <div className="album-name">
                                                    {item.name}
                                                </div>
                                                <div className="album-description">{item.description}</div>
                                            </div>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); setAlbumFormState("edit"); setSelectedAlbum(item); }}
                                                >
                                                    <TbEdit className="edit-icon" />
                                                </button>
                                                <button
                                                    className="action-button"
                                                    onClick={(e) => { e.stopPropagation(); handleAddSongClick(item); }}
                                                >
                                                    <MdOutlinePlaylistAdd className="add-icon" />
                                                </button>
                                                <button
                                                    className="action-button"
                                                    onClick={(e) => { e.stopPropagation(); removeAlbum(item.id) }}
                                                >
                                                    <RiDeleteBack2Line className="remove-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </Header>

                                    {expandedAlbums.has(item.id) && (
                                        <div className="song-list">
                                        {item.songs.map((song) => (
                                                <Song
                                                    key={song.id}
                                                    className="song"
                                                    active={activeSongId === song.id ?? true}
                                                    onClick={() => handleSongClick(song.id, song)}
                                                >
                                                {item.coverImage.preview &&
                                                    <div className="background-image"
                                                        style={{ backgroundImage: `url(${item.coverImage.preview})` }} />}
                                                <div className="overlay" />
                                                <div className="content">
                                                        <div>
                                                            <div className="song-name">{song.name}</div>
                                                            <div className="song-lyrics">{/*{song.lyrics}*/}</div>
                                                        </div>
                                                        <div className="action-buttons" style={{ flexDirection: "row", gap: "5px", right: "10px"} }>
                                                            <button
                                                                className="action-button"
                                                                style={{ height: "35px" }}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedSong(song); setSongFormState("edit"); setSelectedAlbum(item); }}
                                                            >
                                                                <TbEdit className="edit-icon" />
                                                            </button>
                                                            <button
                                                                className="action-button"
                                                                style={{height: "35px"} }
                                                                onClick={(e) => { e.stopPropagation(); removeSong(item.id, song.id); }}
                                                            >
                                                                <RiDeleteBack2Line className="remove-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Song>
                                            ))}
                                         </div>
                                    )}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>

            {singleFormState && (
                <SingleForm
                    onClose={() => { setSingleFormState(null); setSelectedSingle(null); }}
                    onSave={addSingle}
                    editSingle={editSingle}
                    selectedSingle={singleFormState === "edit" ? selectedSingle : null}
                />
            )}

            {albumFormState && (
                <AlbumForm
                    onClose={() => { setAlbumFormState(null); setSelectedAlbum(null); }}
                    onSave={addAlbum}
                    editAlbum={editAlbum}
                    selectedAlbum={albumFormState === "edit" ? selectedAlbum : null}
                />
            )}

            {songFormState && (
                <SongForm
                    onClose={() => { setSongFormState(null); setSelectedSong(null); }}
                    onSave={addSong}
                    editSong={editSong}
                    selectedSong={songFormState === "edit" ? selectedSong : null}
                />
            )}
            

            {/*{selectedSong && (*/}
            {/*    <div className="selected-song">*/}
            {/*        <h3>{selectedSong.name}</h3>*/}
            {/*        <p>{selectedSong.lyrics}</p>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/*{selectedSingle && (*/}
            {/*    <div className="selected-song">*/}
            {/*        <h3>{selectedSingle.name}</h3>*/}
            {/*        <p>{selectedSingle.lyrics}</p>*/}
            {/*    </div>*/}
            {/*)}*/}

        </div>
    );
};

const activeStyleHeader = css`
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.7) inset;
    border: 8px solid rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 1);
`;

const activeBtnStyle = css`
    opacity: 1;
    transform: translateX(0);
`;

const activeStyleSong = css`
    border: 5px solid rgba(255,255,255,1);
    color: rgba(255,255,255,1);
`;

const activeFontStyle = css`
    color: rgba(255,255,255, 1);
`;


const Header = styled.div`
    &.single-header, &.album-header {
        ${({ active }) => active && activeStyleHeader}
    }
    &.single-header .action-button,
    &.album-header .action-button {
        ${({ active }) => active && activeBtnStyle}
    }
    .album-name, .single-name {
         ${({ active }) => active && activeFontStyle}
    }
`;

const Song = styled.div`
    &.song {
        ${({ active }) => active && activeStyleSong}
    }
    &.song .action-button {
        ${({ active }) => active && activeBtnStyle}
    }
    .song-name {
         ${({ active }) => active && activeFontStyle}
    }
`;

export default App;