import React,{ useCallback, useContext, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import AuthContext from "../../utils/AuthContext";

import { MovieDetails } from './Moviedetails';
import { Reviews } from './Reviews';
import { Casts } from './Casts';

export const SingleMovie = ({movieid, seriesid}) => {
    
  const { isLogged, contract, address } = useContext(AuthContext);

  const [moviedetails, setMoviedetails] = useState();
  const [movieloading, setMovieLoading] = useState(true);
  
  const [IsError, setIsError] = useState(false);
  
  const [isReview, setIsReview] = useState(false);
  const [Ratingdetails, setRatingdetails] = useState({
    totalRate: 0,
    avgRate: 0,
  });
  const [userReviews, setUserReviews] = useState([]);
  const [reviewloading, setReviewLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const url = `https://api.themoviedb.org/3/${movieid ? "movie" : "tv"}/${
        movieid ? movieid : seriesid
      }?api_key=${
        process.env.THEMOVIEDB_API_KEY
      }&language=en-US&page=1&append_to_response=videos,images,credits,reviews,external_ids`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMoviedetails(data);
      setMovieLoading(false);
    } catch (err) {
      toast.error(`Failed to fetch movie details: ${err.message}`);
      setIsError(true);
      console.error("Failed to fetch data:", err);
    }
  }, [movieid, seriesid]);

  const getmovierating = useCallback(async () => {
    if (!contract) return;
    
    try {
      const result = await (movieid 
        ? contract.getMovieRating(movieid)
        : contract.getSeriesRating(seriesid));
      
      setRatingdetails({
        totalRate: parseInt(result[1]),
        avgRate: parseInt(result[2]),
      });
    } catch (err) {
      toast.error(`Failed to get rating: ${err.message}`);
      console.error("Error getting rating:", err);
    }
  }, [contract, movieid, seriesid]);
  
  const getmoviereviews = useCallback(async() => {
    if(contract != null){
      if(movieid){
        await contract.GetMovieReviews(movieid)
        .then((res) => {
          setUserReviews(res);
          setReviewLoading(false);
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log("error while getmoviereviews ", err);
        });
      }
      else if(seriesid){
        await contract.GetSeriesReviews(seriesid)
        .then((res) => {
          setUserReviews(res);
          setReviewLoading(false);
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.log("error while getseriesreviews ", err);
        });
       } 
    } 
  }, [contract, movieid, seriesid]);
  
  const checkAlreadyRated = useCallback(async () => {
    if (address != null) {
      if(movieid){
        await contract
        .isMovieRatedByUser(movieid, address)
        .then((res) => {
          setIsReview(res);
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.error("error while checking user already rated", err);
        });
      }
      else{ 
        await contract
        .isSeriesRatedByUser(seriesid, address)
        .then((res) => {
          setIsReview(res);
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          console.error("error while checking user already rated", err);
        });
      }
    }
  }, [address, contract, movieid, seriesid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    getmovierating();
    getmoviereviews();
  }, [getmovierating, getmoviereviews]);
  
  useEffect(() => {
    if (isLogged) {
      checkAlreadyRated();
    }
  }, [address, checkAlreadyRated, isLogged]);

  const handle_retry = useCallback(() => {
    setIsError(false);
    fetchData();
  }, [fetchData]);
    
  return (
    <>
      <div id='moviedetails'>
        <MovieDetails moviedetails={moviedetails} movieloading={movieloading} IsError={IsError} setIsError={setIsError} handle_retry={handle_retry} Ratingdetails={Ratingdetails} seriesid={seriesid} />
        <Reviews
            movieid={movieid}
            moviename={moviedetails?.title}
            seriesid={seriesid}
            seriesname={moviedetails?.name}
            isReview={isReview}
            setIsReview={setIsReview}
            userReviews={userReviews}
            IsError={IsError}
            getmoviereviews={getmoviereviews}
            getmovierating={getmovierating}
            reviewloading={reviewloading}
          />
        <Casts 
          moviedetails={moviedetails}
          IsError={IsError}
         />
        </div>
    </>
  )
}
