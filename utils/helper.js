const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Helper function to format course data
const formatCourse = (course) => ({
    _id: course.id,
    category: course.category,
    course_title: course.course_title,
    course_price: course.course_price,
    course_intro_video_url: course.course_intro_video_url,
    course_total_length: course.course_total_length,
    courses_image: course.courses_image,
    course_short_description: course.course_short_description,
    lessons: course.lessons,
    is_course_paid: course.is_course_paid,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt
});


const formatAllCourse = (course) => ({
    _id: course._id,
    category: course.category,
    course_title: course.course_title,
    course_price: course.course_price,
    course_intro_video_url: course.course_intro_video_url,
    course_total_length: course.course_total_length,
    courses_image: course.courses_image,
    course_short_description: course.course_short_description,
    is_course_paid: course.is_course_paid
});

const responseFormatter = (res, status, data = {}, message) => {
    let foramttedRes = {
        status,
        message
    }
    if (data && (Array.isArray(data) ? data?.length : Object.keys(data).length)) {
        foramttedRes.data = data;
    }
    return res.status(status).json(foramttedRes);
};

const calculateAverageRating = async (events = []) => {
    const eventsWithAverageRating = await Promise.all(events.map(async event => {

        const eventRatings = await prisma.eventRating.findMany({
            where: { eventId: event.id },
            select: { rating: true }
        });

        const ratings = eventRatings.map(eventRating => eventRating.rating);
        const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : null;
        const roundedRating = averageRating !== null ? parseFloat(averageRating) : null;

        return {
            ...event,
            rating: roundedRating,
        };
    }));

    return eventsWithAverageRating;
}

const calculateAverageByEventRatings = (eventRatings = []) => {
    const ratings = eventRatings.map(eventRating => eventRating.rating);
    const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : null;
    return parseFloat(averageRating.toFixed(1));
}

module.exports = { formatCourse, formatAllCourse, responseFormatter, calculateAverageRating, calculateAverageByEventRatings };