    import {configureStore} from '@reduxjs/toolkit'
    import Rootreducer from './rootreducer'

    const store = configureStore({
    reducer:Rootreducer
    });

    export default store;