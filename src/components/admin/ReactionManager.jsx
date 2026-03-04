import EmojiPicker from 'emoji-picker-react'
import { useEffect, useState } from 'react'
import { getReactionOptions } from '../../managers/PostManager.js'
import { createReaction, deleteReaction, updateReaction } from '../../managers/ReactionManager.js'

export const ReactionManger = () => {
    const [reactions, setReactions] = useState([])
    const [isModalActive, setIsModalActive] = useState(false)
    const [selectedReaction, setSelectedReaction] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        getReactionOptions().then(({status, response}) => {
            if (status === 200) {
                response.then(setReactions)
            }
        })
    }, [])

    const handleCreateReaction = (reaction) => {
        createReaction(reaction).then(({status, response}) => {
            if (status === 201) {
                response.then(res => {
                    setReactions(prev => [...prev, res])
                })
            } else if (status === 409) {
                response.then(res => {
                    setError({error: true, msg: res.error})
                })
            }
        })
    }

    const handleDeleteReaction = (reactionId) => {
        deleteReaction(reactionId).then(({status, response}) => {
            if (status === 200) {
                response.then(res => {
                    setReactions(prev => prev.filter(r => r.id !== reactionId))
                })
            }
        })
    }

    const handleUpdateReaction = (reaction) => {
        setSelectedReaction(null)
        updateReaction(reaction).then(({status, response}) => {
            if (status === 200) {
                response.then(res => {
                    setReactions(prev => prev.map(r => {
                        if (r.id !== reaction.id) return r
                        else return res
                    }))
                })
            } else if (status === 409) {
                response.then(res => {
                    setError({error: true, msg: res.error})
                })
            }
        })
    }


    const AddReactionModal = ({handler}) => (
        <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
            <div className='modal-background' onClick={() => setIsModalActive(false)}></div>
            <div className='modal-content'>
                <div className='box'>
                    <EmojiPicker onEmojiClick={(emojiData) => {
                        const reaction = {...selectedReaction, label: emojiData.names.pop(), emoji: emojiData.emoji}
                        handler(reaction)                      
                        setIsModalActive(false)
                    }} /> 
                </div>
            </div>
            <button className='modal-close is-large' aria-label='close' onClick={() => setIsModalActive(false)}></button>
        </div>
    )

    //TODO: Maybe implement some stats to see the most and least popular
    return (
        <>
            <div className='columns is-centered'>
                <div className='column is-half'>
                    <div className='is-flex is-align-items-center mb-5'>
                        <h1 className='title mb-0'>Reactions</h1>
                        <button 
                            className='button is-small ml-3 is-success py-1 px-2'
                            onClick={() => setIsModalActive(true)}
                            >+</button>
                    </div>
                    {error && <div className="notification is-danger">{error.msg}</div>}
                    <table className='table is-striped is-fullwidth'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Reaction</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reactions && reactions.map(r => (
                                <tr key={r.id}>
                                    <td>{r.label}</td>
                                    <td>{r.emoji}</td>
                                    <td>
                                        <button 
                                        className='button is-small is-warning'
                                        onClick={() => {
                                            setSelectedReaction(r)
                                            setIsModalActive(true)
                                        }}
                                        >Edit</button>
                                    </td>
                                    <td>
                                        <button 
                                        className='button is-small is-danger'
                                        onClick={() => handleDeleteReaction(r.id)}
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddReactionModal handler={selectedReaction ? handleUpdateReaction : handleCreateReaction} />
        </>
    )
}