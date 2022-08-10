import React from 'react';
import clsx from 'clsx';
import {Table} from 'react-bootstrap';

const SettingProfile = ({generalSettingItems}) => {
    return (
        <Table hover responsive>
            <tbody>
                {generalSettingItems.map((item, index) => {
                    return (
                        <tr
                            key={index}
                            className={clsx({
                                'border-top border-bottom-0 border-dark':
                                    index === 0,
                                'border-bottom border-dark':
                                    index === generalSettingItems.length - 1,
                            })}
                        >
                            <td className='align-middle'>{item.name}</td>
                            <td className='align-middle'>
                                {item.inputType === 'file' ? (
                                    <img
                                        src={item.value}
                                        alt='Avatar'
                                        height={60}
                                        width={60}
                                        className='rounded-circle'
                                    />
                                ) : item.value ? (
                                    item.value
                                ) : (
                                    ''
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default SettingProfile;
