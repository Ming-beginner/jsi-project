import React, {useEffect, useState, useRef} from 'react';
import {
    db,
    useCurrentUser,
    doc,
    getDoc,
    updateDoc,
    storage,
    ref,
    getDownloadURL,
    auth,
    onSnapshot,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from '../firebase';
import {useUploadFile} from 'react-firebase-hooks/storage';
import {useUpdateProfile, useUpdatePassword} from 'react-firebase-hooks/auth';
import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import {useNavItemContext} from '../context/navItemContext';
import {Button, Form, OverlayTrigger, Popover} from 'react-bootstrap';
import {SettingProfile, Loading, ErrorModal, SuccessModal} from '../components';
import {Formik} from 'formik';
import * as yup from 'yup';
import PasswordIcon from '@mui/icons-material/Password';
import CloseIcon from '@mui/icons-material/Close';

const Setting = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    const {setActiveNavItem} = useNavItemContext();
    const [userInfo, setUserInfo] = useState();
    const [editMode, setEditMode] = useState('off');
    const [passwordEditMode, setPasswordEditMode] = useState('off');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [updateProfileSucess, setUpdateProfileSucess] = useState('');
    const [uploadFile, uploading, snapshot, error] = useUploadFile();
    const [updateProfile, profileUpdating, profileError] =
        useUpdateProfile(auth);
    const [updatePassword, passwordUpdating, passwordError] =
        useUpdatePassword(auth);
    useEffect(() => {
        const getUserInfo = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setUserInfo(docSnap.data());
                setAvatarPreview({preview: docSnap.data().avatar});
            }
        };
        if (!currentUser) {
            navigate('/login');
        } else {
            setActiveNavItem('settings');
            getUserInfo();
            const userRef = doc(db, 'users', currentUser.uid);
            const unsub = onSnapshot(userRef, (doc) => {
                setUserInfo(doc.data());
            });
            return () => unsub();
        }
    }, []);
    useEffect(() => {
        return () => URL.revokeObjectURL(avatarPreview);
    }, [avatarPreview]);
    const generalSettingItems = [
        {
            name: 'Avatar',
            value: userInfo?.avatar,
            inputType: 'file',
        },
        {
            name: 'Bio',
            value: userInfo?.bio,
            inputType: 'text',
        },
        {
            name: 'Name',
            value: userInfo?.name,
            inputType: 'text',
        },
        {name: 'Email', value: userInfo?.email, inputType: 'email'},
    ];
    const buttonsRef = useRef();
    const formSchema = yup.object().shape({
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
        name: yup.string().required('Username is required'),
        bio: yup.string(),
    });
    const passwordSchema = yup.object().shape({
        current: yup
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Current password is required'),
        new: yup
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .required('New password is required'),
        newConfirm: yup
            .string()
            .required('Password confirmation is required')
            .oneOf([yup.ref('new'), null], 'Incorrect password'),
    });
    const handleUpdateUserData = async (values) => {
        const avatarRef = ref(storage, `avatar/${currentUser.uid}.png`);
        const userDoc = doc(db, 'users', currentUser.uid);
        let downloadUrl;
        if (avatarPreview.preview !== userInfo.avatar) {
            await uploadFile(avatarRef, avatarPreview, {
                contentType: 'image/png',
            });
            downloadUrl = await getDownloadURL(avatarRef);
        }
        await updateDoc(userDoc, {
            name: values.name,
            email: values.email,
            bio: values.bio,
            avatar: downloadUrl || userInfo.avatar,
        });
        await updateProfile({
            displayName: values.name,
            photoURL: downloadUrl || userInfo.avatar,
            email: values.email,
        });
        setUpdateProfileSucess('Updated profile successfully!');
        setEditMode('off');
    };

    const handleChangePassword = async (values, {resetForm}) => {
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            values.current
        );
        try {
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(values.new);
            setPasswordEditMode('off');
            resetForm();
            setAuthSuccess('Changed password successfully');
        } catch (error) {
            setAuthError(error);
        }
    };
    if (currentUser) {
        return (
            <div
                className='d-flex justify-content-center w-100 p-5 flex-column setting-page'
                style={{height: 'max-content'}}
            >
                <ErrorModal
                    error={error || profileError || authError || passwordError}
                />
                <Loading
                    isLoading={uploading || profileUpdating || passwordUpdating}
                />
                <SuccessModal success={authSuccess || updateProfileSucess} />
                <div className='w-100 mb-5'>
                    <div className='d-flex justify-content-between w-100 align-items-center'>
                        <p className='fs-2'>Profile</p>
                        <Button
                            variant='primary'
                            onClick={() => {
                                if (editMode === 'on') {
                                    setEditMode('off');
                                } else {
                                    setEditMode('on');
                                    buttonsRef.current.scrollIntoView({
                                        behavior: 'smooth',
                                    });
                                }
                            }}
                        >
                            {editMode === 'on' ? <CloseIcon /> : 'Edit'}
                        </Button>
                    </div>
                    <SettingProfile generalSettingItems={generalSettingItems} />
                    <Formik
                        enableReinitialize
                        validationSchema={formSchema}
                        initialValues={{
                            email: generalSettingItems[3].value || '',
                            name: userInfo?.name || '',
                            bio: userInfo?.bio || '',
                        }}
                        onSubmit={handleUpdateUserData}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            errors,
                        }) => {
                            return (
                                <Form
                                    onSubmit={handleSubmit}
                                    className={clsx('bg-white p-3 mt-2', {
                                        'd-none': editMode === 'off',
                                    })}
                                >
                                    <p className='fs-2'>Update Profile</p>
                                    <Form.Group
                                        className='mb-3'
                                        controlId='formBasic1'
                                    >
                                        <div className='w-100 d-flex justify-content-center mb-3'>
                                            <img
                                                src={avatarPreview.preview}
                                                alt='avatar'
                                                className='border border-dark rounded-circle'
                                                height={70}
                                                width={70}
                                            />
                                        </div>
                                        <Form.Control
                                            type='file'
                                            accept='image/*'
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                file.preview =
                                                    URL.createObjectURL(file);
                                                setAvatarPreview(file);
                                            }}
                                            onBlur={handleBlur}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className='mb-3'
                                        controlId='formBasic2'
                                    >
                                        <Form.Control
                                            type='text'
                                            name='bio'
                                            value={values.bio}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder='Enter Bio'
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className='mb-3'
                                        controlId='formBasic3'
                                    >
                                        <Form.Control
                                            type='text'
                                            name='name'
                                            placeholder='Enter a name'
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={
                                                touched.name && !errors.name
                                            }
                                            isInvalid={errors.name}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group
                                        className='mb-3'
                                        controlId='formBasic4'
                                    >
                                        <Form.Control
                                            type='email'
                                            name='email'
                                            placeholder='Enter email'
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={
                                                touched.email && !errors.email
                                            }
                                            isInvalid={errors.email}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group
                                        className='w-100 d-flex justify-content-end'
                                        ref={buttonsRef}
                                    >
                                        <Button
                                            variant='primary'
                                            type='submit'
                                            className='me-3'
                                        >
                                            Save changes
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            type='button'
                                            onClick={() => setEditMode('off')}
                                        >
                                            Cancel
                                        </Button>
                                    </Form.Group>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
                <div className='mt-3'>
                    <p className='fs-2'>Password</p>
                    <OverlayTrigger
                        overlay={
                            currentUser.providerData[0].providerId ===
                            'google.com' ? (
                                <Popover id='popover-basic'>
                                    <Popover.Header as='h3'>
                                        OOPS!!!
                                    </Popover.Header>
                                    <Popover.Body>
                                        You are using Google as the provider.
                                        There's no need to change the password.
                                    </Popover.Body>
                                </Popover>
                            ) : (
                                <></>
                            )
                        }
                    >
                        <div>
                            <div
                                className={clsx(
                                    'bg-white border border-dark w-100',
                                    {
                                        'not-allowed':
                                            currentUser.providerData[0]
                                                .providerId === 'google.com',
                                    }
                                )}
                                data-bs-toggle='tooltip'
                                data-bs-title='Default tooltip'
                            >
                                <div className='border-bottom w-100 d-flex '>
                                    <div className='h-100 d-flex justify-content-center align-items-center p-3'>
                                        <PasswordIcon fontSize='large' />
                                    </div>
                                    <div className='d-flex flex-column ms-2 p-1'>
                                        <p className='fw-bold fs-5 m-0'>
                                            Change password
                                        </p>
                                        <p className='text-muted m-0'>
                                            It's a good idea to use a strong
                                            password that you're not using
                                            elsewhere
                                        </p>
                                    </div>
                                    <div className='ms-auto d-flex justify-content-center align-items-center h-100 p-3'>
                                        <Button
                                            variant='secondary'
                                            className={clsx({
                                                'not-allowed':
                                                    currentUser.providerData[0]
                                                        .providerId ===
                                                    'google.com',
                                            })}
                                            onClick={() =>
                                                currentUser.providerData[0]
                                                    .providerId === 'google.com'
                                                    ? null
                                                    : setPasswordEditMode(
                                                          (prevMode) =>
                                                              prevMode === 'on'
                                                                  ? 'off'
                                                                  : 'on'
                                                      )
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Formik
                                    initialValues={{
                                        current: '',
                                        new: '',
                                        newConfirm: '',
                                    }}
                                    onSubmit={handleChangePassword}
                                    validationSchema={passwordSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        /* and other goodies */
                                    }) => (
                                        <Form
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className={clsx(
                                                'w-100 d-flex flex-column bg-white p-3 mt-3',
                                                {
                                                    'd-none':
                                                        passwordEditMode ===
                                                        'off',
                                                }
                                            )}
                                        >
                                            <Form.Group
                                                md='3'
                                                controlId='validationFormik01'
                                                className='mb-3'
                                            >
                                                <Form.Label>
                                                    Current Password
                                                </Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    name='current'
                                                    value={values.current}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={
                                                        touched.current &&
                                                        !errors.current
                                                    }
                                                    isInvalid={errors.current}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.current}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                md='3'
                                                controlId='validationFormik02'
                                                className='mb-3'
                                            >
                                                <Form.Label>
                                                    New Password
                                                </Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    name='new'
                                                    value={values.new}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={
                                                        touched.new &&
                                                        !errors.new
                                                    }
                                                    isInvalid={errors.new}
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.new}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                md='3'
                                                controlId='validationFormik03'
                                                className='mb-3'
                                            >
                                                <Form.Label>
                                                    Confirm new password
                                                </Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    name='newConfirm'
                                                    value={values.newConfirm}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isValid={
                                                        touched.newConfirm &&
                                                        !errors.newConfirm
                                                    }
                                                    isInvalid={
                                                        errors.newConfirm
                                                    }
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.newConfirm}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <div className='d-flex justify-content-end'>
                                                <Button
                                                    type='submit'
                                                    className='me-3'
                                                >
                                                    Save change
                                                </Button>
                                                <Button
                                                    type='button'
                                                    variant='secondary'
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }
};

export default Setting;
