import {Injectable} from 'angular2/core';
import {Track} from './track'
import {Http, Headers} from 'angular2/http';

@Injectable()
export class DataProvider {
  private _audio = document.createElement("AUDIO")
  public userId : String;

  getTracks(){
    return Promise.resolve(TRACKS)
  }
}

var TRACKS:Track[] = [
  {id: 744511, info: 'testInfo' },
  {id: 243055839, info: 'testInfo' },
  {id: 1796599, info: 'testInfo' },
  {id: 2035216, info: 'testInfo' },
  {id: 2866657, info: 'testInfo' },
  {id: 2866670, info: 'testInfo' },
  {id: 3888633, info: 'testInfo' },
  {id: 3988594, info: 'testInfo' },
  {id: 4578009, info: 'testInfo' },
  {id: 4644899, info: 'testInfo' },
  {id: 4679291, info: 'testInfo' },
  {id: 4679567, info: 'testInfo' },
  {id: 5395756, info: 'testInfo' },
  {id: 5506457, info: 'testInfo' },
  {id: 6312839, info: 'testInfo' },
  {id: 6722117, info: 'testInfo' },
  {id: 7145290, info: 'testInfo' },
  {id: 7577030, info: 'testInfo' },
  {id: 7577086, info: 'testInfo' },
  {id: 7577156, info: 'testInfo' }
]

// var TRACKS:Track[] = [
//   {id: 744511, info:{title: 'testTitle1', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 243055839, info:{title: 'testTitle2', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 1796599, info:{title: 'testTitle3', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 2035216, info:{title: 'testTitle4', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 2866657, info:{title: 'testTitle5', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 2866670, info:{title: 'testTitle6', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 3888633, info:{title: 'testTitle7', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 3988594, info:{title: 'testTitle8', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 4578009, info:{title: 'testTitle9', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 4644899, info:{title: 'testTitle10', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 4679291, info:{title: 'testTitle11', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 4679567, info:{title: 'testTitle12', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 5395756, info:{title: 'testTitle13', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 5506457, info:{title: 'testTitle14', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 6312839, info:{title: 'testTitle15', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 6722117, info:{title: 'testTitle16', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 7145290, info:{title: 'testTitle17', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 7577030, info:{title: 'testTitle18', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 7577086, info:{title: 'testTitle19', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} },
//   {id: 7577156, info:{title: 'testTitle20', artwork-url:"https://i1.sndcdn.com/artworks-000002257825-3czv6y-large.jpg", username:"hipsy"} }
// ]
