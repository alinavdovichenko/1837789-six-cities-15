import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {ThunkApiConfig} from '../types/thunk';
import {AppDispatch, State} from '../types/state';
import {Offers, Offer} from '../types/offer';
import {Reviews, Review} from '../types/review';
import {CommentData} from '../types/comments';
import {redirectToRoute} from './action';
import {saveToken, dropToken} from '../services/token';
import {ApiRoute, AppRoute} from '../const';
import {AuthData} from '../types/auth-data';
import {UserConnect} from '../types/user';
import {FavoriteData} from '../types/favorites';
import {setFavoriteOffers} from './offers-process/offers-process';
import {setFavoriteOffer} from './offer-process/offer-process';
import {setFavoriteNearby} from './offers-nearby-process/offers-nearby-process';


export const fetchOffersAction = createAsyncThunk<Offers, undefined, ThunkApiConfig>
('fetchOffers',async (_arg, {extra: api}) => {
  const {data} = await api.get<Offers>(ApiRoute.Offers);

  return data;
});

export const checkAuthAction = createAsyncThunk<UserConnect, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}
>('checkAuth', async (_arg, {extra: api}) => {
  const {data} = await api.get<UserConnect>(ApiRoute.Login);

  return data;
},
);

export const loginAction = createAsyncThunk<UserConnect, AuthData, ThunkApiConfig>
('login', async ({email: email, password}, {dispatch, extra: api}) => {
  try {
    const {data} = await api.post<UserConnect>(ApiRoute.Login, {email, password});
    const {token} = data;
    saveToken(token);
    dispatch(redirectToRoute(AppRoute.Main));

    return data;

  } catch (error) {
    throw new Error();
  }
});

export const logoutAction = createAsyncThunk<void, undefined, ThunkApiConfig>
('logout', async (_arg, {extra: api}) => {
  await api.delete(ApiRoute.Logout);
  dropToken();
});

export const fetchOfferAction = createAsyncThunk<
  Offer,
  number | string | undefined,
  ThunkApiConfig
>('fetchOffer', async (_arg, {extra: api}) => {
  const id = _arg;

  const {data} = await api.get<Offer>(`${ApiRoute.Offers}/${id}`);

  return data;
});

export const fetchReviewsAction = createAsyncThunk<
  Reviews,
  number | string | undefined,
  ThunkApiConfig>
  ('fetchReviews', async (_arg, {extra: api}) => {
    const id = _arg;
    const {data} = await api.get<Reviews>(`${ApiRoute.Comments}/${id}`);

    return data;
  });

export const fetchOffersNearbyAction = createAsyncThunk<
  Offers,
  number | string | undefined,
  ThunkApiConfig
  >('fetchOffersNearby', async (_arg, { extra: api}) => {
    const id = _arg;

    const {data} = await api.get<Offers>(`${ApiRoute.Offers}/${id}/nearby`);

    return data;
  });

export const submitReviewAction = createAsyncThunk<
    Review,
    CommentData,
    ThunkApiConfig
  >('submitComment',
    async ({id, comment, rating}, {extra: api}) => {
      try {
        const {data} = await api.post<Review>(`${ApiRoute.Comments}/${id}`, {
          comment: comment,
          rating: rating,
        });
        return data;
      } catch (error) {
        throw new Error();
      }
    });

export const fetchFavoritesAction = createAsyncThunk<
  Offers,
  undefined,
  ThunkApiConfig
>('fetchFavorites', async (_arg, {extra: api}) => {
  const {data} = await api.get<Offers>(ApiRoute.Favorite);

  return data;
});

export const setFavoritesAction = createAsyncThunk<
  Offer,
  FavoriteData,
  ThunkApiConfig
>('setFavorites', async (favoriteParams: FavoriteData, {dispatch, extra: api}) => {
  const {data} = await api.post<Offer>(
    `${ApiRoute.Favorite}/${favoriteParams.offerId}/${favoriteParams.status}`
  );
  dispatch(setFavoriteOffers(data));
  dispatch(setFavoriteOffer(data.isFavorite));
  dispatch(setFavoriteNearby(data));

  return data;
}
);

