import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEffect, useState } from 'react'
import { getReactionOptions } from '../../managers/PostManager.js'

export const ReactionManger = () => {
    const [reactions, setReactions] = useState([])

    useEffect(() => {
        getReactionOptions().then(({status, response}) => {
            if (status === 200) {
                response.then(setReactions)
            }
        })
    }, [])

    //TODO: Maybe implement some stats to see the most and least popular
    return (
        <div className='columns is-centered'>
            <div className='column is-half'>
                <div className='is-flex is-align-items-center mb-5'>
                    <h1 className='title mb-0'>Reactions</h1>
                    <button className='button is-small ml-3 is-success py-1 px-2'>+</button>
                </div>
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
                            <tr>
                                <td>{r.label}</td>
                                <td>{r.emoji}</td>
                                <td>
                                    <button className='button is-small is-warning'>Edit</button>
                                </td>
                                <td>
                                    <button className='button is-small is-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        //<Picker data={data} onEmojiSelect={console.log}/>
    )
}