import express from 'express';
import auth from './auth';
import review from './review';
import member from './member';
import upload from './upload';
import log from './log';
import sms from './sms';
import term from './term';
import region from './region';
import subject from './subject';
import filter from './filter';
import institute from './institute';
import tutor from './tutor';
import follow from './follow';
import board from './board';
import banner from './banner';
import calendar from './calendar';
import search from './search';
import cheating from './cheating';
import statistics from './statistics';
import site from './site';
import cafe from './cafe';
import customer from './customer';
import email from './email';

import admin from './admin/router';
import { decodeToken } from '../../services/auth/jwt';

const router = express.Router();

// Request Ip Reform
router.use('*', (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	req.ipAddress = ip;
	next();
});

router.use('/auth', auth);

// JWT 인증
// eslint-disable-next-line
router.use('*', async function(req, res, next) {
	const token = req.headers['x-access-token'] || req.query.token;
	req.encodedToken = token;
	try {
		req.decodedToken = await decodeToken(!token ? null : token);
		return next();
	} catch (err) {
		return next(err);
	}
});

// 회원
router.use('/members', member);

// 파일
router.use('/file', upload);

// 로그
router.use('/log', log);

// SMS
router.use('/sms', sms);

// 약관
router.use('/terms', term);

// 지역
router.use('/regions', region);

// 과목
router.use('/subjects', subject);

// 필터
router.use('/filters', filter);

// 기관
router.use('/institutes', institute);

// 강사
router.use('/tutors', tutor);

// 리뷰
router.use('/reviews', review);

// 팔로우
router.use('/follows', follow);

// 게시판
router.use('/boards', board);

// 배너-사커필드
router.use('/banners', banner);

// 사이트 캘린더
router.use('/calendars', calendar);

router.use('/calendar', calendar);

// 검색
router.use('/search', search);

// 통계 랭킹
router.use('/statistics', statistics);

// 신고
router.use('/cheating', cheating);

// 사이트
router.use('/sites', site);

// 카페
router.use('/cafes', cafe);

// 고객센터
router.use('/customers', customer);

// 이메일
router.use('/emails', email);

// 관리자
router.use('/admins', admin);

export default router;
