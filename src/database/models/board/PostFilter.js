'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { AnswerStatus, FaqCategory, InfoCategory, LectureType, AppointmentSubType, LocalRegion, GongLocalRegion, Sex } from '../../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class PostFilter extends Model {
		static associate(models) {
			PostFilter.hasOne(models.BoardConfig, { as: 'board_config', foreignKey: 'id', sourceKey: 'board_config_id', constraints: false });
			PostFilter.hasOne(models.BoardPost, { as: 'board_post', foreignKey: 'id', sourceKey: 'post_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'lv1_filter', foreignKey: 'id', sourceKey: 'lv1_id', constraints: false });
			PostFilter.hasOne(models.Institute, { as: 'institute', foreignKey: 'id', sourceKey: 'institute_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'transfer_type_filter', foreignKey: 'id', sourceKey: 'transfer_filter_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'subject_filter', foreignKey: 'id', sourceKey: 'subject_filter_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'speciality_part_filter', foreignKey: 'id', sourceKey: 'gong_speciality_part_filter_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'grade_filter', foreignKey: 'id', sourceKey: 'gong_grade_filter_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'serial_filter', foreignKey: 'id', sourceKey: 'gong_serial_filter_id', constraints: false });
			PostFilter.hasOne(models.Filter, { as: 'certificate_filter', foreignKey: 'id', sourceKey: 'certificate_filter_id', constraints: false });
		}
	}

	PostFilter.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			post_id: field(DataTypes.BIGINT.UNSIGNED, '게시물 인덱스', false),
			board_config_id: field(DataTypes.BIGINT.UNSIGNED, '게시판 설정 인덱스', false),
			lv05_id: field(DataTypes.INTEGER.UNSIGNED, 'LV05 코드', true, { defaultValue: null }),
			lv1_id: field(DataTypes.INTEGER.UNSIGNED, 'LV1 코드, NULL 인 경우 LV1 에 소속되지 않은 전체', true, { defaultValue: null }),
			institute_id: field(DataTypes.BIGINT.UNSIGNED, '기관 인덱스', true, { defaultValue: null }),
			answer_status: field(DataTypes.ENUM(AnswerStatus.values()), '답변 상태', true, { defaultValue: null }),
			faq_category: field(DataTypes.ENUM(FaqCategory.values()), 'FAQ 카테고리', true, { defaultValue: null }),
			info_category: field(DataTypes.ENUM(InfoCategory.values()), '별별정보 말머리', true, { defaultValue: null }),
			lecture_type: field(DataTypes.ENUM(LectureType.values()), '수강유형', true, { defaultValue: null }),
			sex: field(DataTypes.ENUM(Sex.values()), '성별', true, { defaultValue: null }),
			transfer_filter_id: field(DataTypes.INTEGER.UNSIGNED, '편입 학교 필터 인덱스', true, { defaultValue: null }),
			appointment_subtype: field(DataTypes.ENUM(AppointmentSubType.values()), '초등/유아임용 하위구분', true, { defaultValue: null }),
			appointment_local_region: field(DataTypes.ENUM(LocalRegion.values()), '임용 지역 구분', true, { defaultValue: null }),
			subject_filter_id: field(DataTypes.INTEGER.UNSIGNED, '과목 필터 인덱스', true, { defaultValue: null }),
			year: field(DataTypes.INTEGER(4).UNSIGNED, '년도', true, { defaultValue: null }),
			gong_local_region: field(DataTypes.ENUM(GongLocalRegion.values()), '공무원 소속 지역', true, { defaultValue: null }),
			gong_speciality_part_filter_id: field(DataTypes.INTEGER.UNSIGNED, '공무원 직군 필터 인덱스', true, { defaultValue: null }),
			gong_grade_filter_id: field(DataTypes.INTEGER.UNSIGNED, '공무원 급수 필터 인덱스', true, { defaultValue: null }),
			gong_serial_filter_id: field(DataTypes.INTEGER.UNSIGNED, '공무원 직렬 필터 인덱스', true, { defaultValue: null }),
			sub_filter_id: field(DataTypes.INTEGER.UNSIGNED, '서브 필터 인덱스', true, { defaultValue: null }),
			certificate_filter_id: field(DataTypes.INTEGER.UNSIGNED, '자격증 필터 인덱스', true, { defaultValue: null }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'post_filter',
			comment: '게시물 단일 필터',
			indexes: [
				{ fields: ['post_id'] },
				{ fields: ['board_config_id'] },
				{ fields: ['lv1_id'] },
				{ fields: ['institute_id'] },
				{ fields: ['transfer_filter_id'] },
				{ fields: ['subject_filter_id'] },
				{ fields: ['gong_speciality_part_filter_id'] },
				{ fields: ['gong_grade_filter_id'] },
				{ fields: ['gong_serial_filter_id'] },
				{ fields: ['subject_filter_id'] },
			],
			sequelize,
		},
	);

	return PostFilter;
};
