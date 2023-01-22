import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { ContextFunction } from '../../Context/Context';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    Slide,
    IconButton,
} from '@mui/material'
import './Cart.css'
import Rating from '../../Components/Rating';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'


import { AiFillCloseCircle, AiOutlineLogin, AiFillDelete, AiFillInfoCircle } from 'react-icons/ai'
import { FcInfo } from 'react-icons/fc'
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [total, setTotal] = useState(0)
    const [shippingCost, setShippingCoast] = useState(100)

    const [isReadMode, SetisReadMode] = useState(true)
    const [openAlert, setOpenAlert] = useState(false);

    const navigate = useNavigate()
    let shipping = total >= 1000 ? 0 : shippingCost
    let proceed = false
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? proceed = true : proceed = false



    useEffect(() => {
        if (setProceed) {
            getCart()
        }
        else {
            setOpenAlert(true)
        }
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        setTotal(cart.reduce((acc, curr) => acc + (curr.price), 0))
    }, [cart])
    console.log(total);
    const getCart = async () => {
        if (authToken !== null) {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
            setCart(data);
        }

    }
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };


    const removeFromCart = async (product) => {
        if (setProceed) {
            const response = await axios.delete(`${process.env.REACT_APP_DELETE_CART}/${product.productId}`, {
                headers: {
                    'Authorization': authToken
                }
            })
            toast.error("Removed From Cart", { autoClose: 500, })
            getCart()
        }
    }
    return (
        <div className='main-cart-container'>
            <Box className='cart-cards'>
                {setProceed &&

                    cart.map(prod => <Card key={prod._id} sx={{ width: 300, margin: "30px 10px 0 10px" }}>

                        <Link to={`/Detail/${prod.productId}`} >

                            <CardActionArea>
                                <Box className='img-box'  >
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        width="100%"
                                        alt={prod.name}
                                        src={prod.image}
                                        className='img'

                                    />
                                </Box>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                                        {isReadMode ? prod.name.slice(0, 20) : prod.name}
                                        {
                                            prod.name.length > 15 &&
                                            <span
                                                onClick={() => SetisReadMode(!isReadMode)}>
                                                {isReadMode ? "..." : ""}
                                            </span>
                                        }
                                    </Typography>
                                    <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                                        ₹{prod.price}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Link>
                        <CardActions style={{ display: "flex", justifyContent: "space-around" }}>
                            <Tooltip title='Remove From Cart'>
                                <Button variant='contained' color='error' onClick={() => removeFromCart(prod)} endIcon={<AiFillDelete />} >Remove</Button>
                            </Tooltip>
                            <Rating rating={prod.rating} />
                        </CardActions>
                        <ToastContainer />
                    </Card >)

                }
            </Box>
            <Box className='total-card'>
                <CardActionArea >
                    <CardContent>
                        <span> Total Amount =  ₹{total} </span>
                        <br />
                        <span> Shipping Cost = ₹{shipping}   </span>
                        <Tooltip title="There will no shipping charge If total order is greater than ₹1000" placement="right-start">

                            <IconButton>
                                <AiFillInfoCircle color='#1976d2' />
                            </IconButton>
                        </Tooltip>

                        <br />
                        <span>Bill Amount = ₹{total + shipping}</span>
                    </CardContent>
                </CardActionArea>
            </Box>
            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'> Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon=<AiOutlineLogin /> color='primary'>Login</Button>
                    <Button variant='contained' color='error' endIcon=<AiFillCloseCircle /> onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Cart