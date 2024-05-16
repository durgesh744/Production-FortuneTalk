import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Otp from '../screens/Otp';
import Register from '../screens/Register';
import LocationSearch from '../screens/LocationSearch';
import DrawerNavigatior from './DrawerNavigatior';
import Wallet from '../screens/Wallet';
import PaymentMethods from '../screens/PaymentMethods';
import AstrologerDetailes from '../screens/AstrologerDetailes';
import ChatScreen from '../screens/ChatScreen';
import History from '../screens/History';
import Settings from '../screens/Settings';
import AstrologyBlogs from '../screens/AstrologyBlogs';
import AstrologyBlogDetails from '../screens/AstrologyBlogDetails';
import AudiencePage from '../screens/AudiencePage';
import AcceptChat from '../screens/AcceptChat';
import WalletHistory from '../screens/History/WalletHistory';
import Remedies from '../screens/Remedy/Remedies';
import PaidRemedy from '../screens/Remedy/PaidRemedy';
import ECommerce from '../screens/Ecommerce/ECommerce';
import ProductDetailes from '../screens/Ecommerce/ProductDetailes';
import Cart from '../screens/Ecommerce/Cart';
import FreeInsights from '../screens/FreeInsights';
import Following from '../screens/Following';
import SupportChat from '../screens/SupportChat';
import AstrologerApply from '../screens/AstrologerApply';
import EcommerceSubCategory from '../screens/Ecommerce/EcommerceSubCategory';
import Courses from '../screens/Courses/Courses';
import ViewRemedy from '../screens/Remedy/ViewRemedy';
import RemedyForm from '../screens/Remedy/RemedyForm';
import RemedyTracking from '../screens/Remedy/RemedyTracking';
import Profile from '../screens/Profile';
import MatchMaking from '../screens/Kundli/MatchMaking';
import MatchingReport from '../screens/Kundli/MatchingReport';
import Panchang from '../screens/Kundli/Panchang';
import FreeKundli from '../screens/Kundli/FreeKundli';
import KundliDetailes from '../screens/Kundli/KundliDetailes';
import TarotReading from '../screens/Tarot/TarotReading';
import OneTarotReading from '../screens/Tarot/OneTarotReading';
import OneTarotDetailes from '../screens/Tarot/OneTarotDetailes';
import OfferAstrologers from '../screens/OfferAstrologers';
import RecentAstrologers from '../screens/RecentAstrologers';
import KundliList from '../screens/Kundli/KundliList';
import GoLive from '../screens/GoLive';
import FreeRemedy from '../screens/Remedy/FreeRemedy';
import MyRemedy from '../screens/Remedy/MyRemedy';
import RemedyBookingDetails from '../screens/Remedy/RemedyBookingDetails';
import PoojaAstrologer from '../screens/Ecommerce/PoojaAstrologer';
import PoojaDetails from '../screens/Ecommerce/PoojaDetails';
import PoojaPayement from '../screens/Ecommerce/PoojaPayement';
import AstroLive from '../screens/AstroLive';
import MyCourses from './MyCourses';
import DemoClass from '../screens/Courses/DemoClass';
import PoojaAstroUploads from '../screens/Ecommerce/PoojaAstroUploads';
import PoojaHistoryDetailes from '../screens/Ecommerce/PoojaHistoryDetailes';
import PersonalDetailes from '../screens/Ecommerce/PersonalDetailes';
import Products from '../screens/Ecommerce/Products';
import BookPooja from '../screens/Ecommerce/BookPooja';
import ProductTracking from '../screens/Ecommerce/ProductTracking';
import ProductSuccessBooking from '../screens/Ecommerce/ProductSuccessBooking';
import ProductHistoryDetails from '../screens/Ecommerce/ProductHistoryDetails';
import ClassLive from '../screens/Courses/ClassLive';
import TarotTeachers from '../screens/Courses/TarotTeachers';
import TeacherDetails from '../screens/Courses/TeacherDetails';
import DemoClassOverview from '../screens/Courses/DemoClassOverview';
import DemoClassDetails from '../screens/Courses/DemoClassDetails';
import FreePdf from '../screens/Courses/FreePdf';
import ScheduleCourse from '../screens/Courses/ScheduleCourse';
import PaidPdf from '../screens/Courses/PaidPdf';
import PaidPdfDetails from '../screens/Courses/PaidPdfDetails';
import CourseBookingDetails from '../screens/Courses/CourseBookingDetails';
import FloatingHeart from '../screens/FloatingHeart';
import SearchAstrologers from '../screens/SearchAstrologers';
import YouTubeShorts from '../screens/YouTubeShorts';
import RemedyHistoryDetails from '../screens/Remedy/RemedyHistoryDetails';
import LiveClasses from '../screens/Courses/LiveClasses';
import LiveNow from '../screens/Courses/LiveNow';
import Privacy from '../screens/Privacy';
import Terms from '../screens/Terms';
import TesetimonialsDetails from '../screens/TesetimonialsDetails';
import OnlineAstrologers from '../screens/OnlineAstrologers';
import NewKundli from '../screens/Kundli/NewKundli';
import KundliCategory from '../screens/Kundli/KundliCategory';
import BirthDetails from '../screens/Kundli/BirthDetails';
import PlanetaryDetails from '../screens/Kundli/PlanetaryDetails';
import HoroscopeChart from '../screens/Kundli/HoroscopeChart';
import KPChart from '../screens/Kundli/KPChart';
import KundliDosh from '../screens/Kundli/KundliDosh';
import VimshottariDasha from '../screens/Kundli/VimshottariDasha';
import KundliReport from '../screens/Kundli/KundliReport';
import Favourable from '../screens/Kundli/Favourable';
import KundliRemedies from '../screens/Kundli/KundliRemedies';
import MatchCategory from '../screens/Panchang/MatchCatagory';
import MatchBirthDetail from '../screens/Panchang/MatchBirthDetail';
import MatchHoroscopeChart from '../screens/Panchang/MatchHoroscopeChart';
import MatchAshtakoota from '../screens/Panchang/MatchAshtakoota';
import MatchDashakoota from '../screens/Panchang/MatchDashakoota';
import ManglikMatch from '../screens/Panchang/ManglikMatch';
import MatchConclusion from '../screens/Panchang/MatchConclusion';
import MainPanchang from '../screens/Panchang/MainPanchang';
import PanchangList from '../screens/Panchang/PanchangList';
import MatchingKundliList from '../screens/Kundli/MatchingKundliList';
import ChatSummary from '../screens/History/ChatSummary';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="locationSearch" component={LocationSearch} />
      <Stack.Screen name="home" component={DrawerNavigatior} />
      <Stack.Screen name="wallet" component={Wallet} />
      <Stack.Screen name="paymentMethods" component={PaymentMethods} />
      <Stack.Screen name="astrologerDetailes" component={AstrologerDetailes} />
      <Stack.Screen name="chatScreen" component={ChatScreen} />
      <Stack.Screen name="chatSummary" component={ChatSummary} />
      <Stack.Screen name="history" component={History} />
      <Stack.Screen name="settings" component={Settings} />
      <Stack.Screen name="astrologyBlogs" component={AstrologyBlogs} />
      <Stack.Screen
        name="astrologyBlogDetails"
        component={AstrologyBlogDetails}
      />
      <Stack.Screen name="acceptChat" component={AcceptChat} />
      <Stack.Screen name="walletHistory" component={WalletHistory} />
      <Stack.Screen name="remedies" component={Remedies} />
      <Stack.Screen name="paidRemedy" component={PaidRemedy} />
      <Stack.Screen name="freeInsights" component={FreeInsights} />
      <Stack.Screen name="following" component={Following} />
      <Stack.Screen name="supportChat" component={SupportChat} />
      <Stack.Screen name="astrologerApply" component={AstrologerApply} />
      <Stack.Screen name="viewRemedy" component={ViewRemedy} />
      <Stack.Screen name="remedyForm" component={RemedyForm} />
      <Stack.Screen name="remedyTracking" component={RemedyTracking} />
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="matchMaking" component={MatchMaking} />
      <Stack.Screen name="matchingReport" component={MatchingReport} />
      <Stack.Screen name="panchang" component={Panchang} />
      <Stack.Screen name="freeKundli" component={FreeKundli} />
      <Stack.Screen name="kundliDetailes" component={KundliDetailes} />
      <Stack.Screen name="tarotReading" component={TarotReading} />
      <Stack.Screen name="oneTarotReading" component={OneTarotReading} />
      <Stack.Screen name="oneTarotDetailes" component={OneTarotDetailes} />
      <Stack.Screen name="offerAstrologers" component={OfferAstrologers} />
      <Stack.Screen name="recentAstrologers" component={RecentAstrologers} />
      <Stack.Screen name="kundliList" component={KundliList} />
      <Stack.Screen name="goLive" component={GoLive} />
      <Stack.Screen name="astroLive" component={AstroLive} />
      <Stack.Screen name="freeRemedy" component={FreeRemedy} />
      <Stack.Screen name="myRemedy" component={MyRemedy} />
      <Stack.Screen name="newKundli" component={NewKundli} />
      <Stack.Screen name="kundliCategory" component={KundliCategory} />
      <Stack.Screen name="birthDetails" component={BirthDetails} />
      <Stack.Screen name="planetaryDetails" component={PlanetaryDetails} />
      <Stack.Screen name="horoscopeChart" component={HoroscopeChart} />
      <Stack.Screen name="kpChart" component={KPChart} />
      <Stack.Screen name="kundliDosh" component={KundliDosh} />
      <Stack.Screen name="vimshottariDasha" component={VimshottariDasha} />
      <Stack.Screen name="kundlireport" component={KundliReport} />
      <Stack.Screen name="favourable" component={Favourable} />
      <Stack.Screen name="kundliRemedies" component={KundliRemedies} />
      <Stack.Screen name="matchCategory" component={MatchCategory} />
      <Stack.Screen name="matchBirthDetail" component={MatchBirthDetail} />
      <Stack.Screen name="matchHoroscopeChart" component={MatchHoroscopeChart} />
      <Stack.Screen name="matchAshtakoota" component={MatchAshtakoota} />
      <Stack.Screen name="matchDashakoota" component={MatchDashakoota} />
      <Stack.Screen name="manglikMatch" component={ManglikMatch} />
      <Stack.Screen name="matchConclusion" component={MatchConclusion} />
      <Stack.Screen name="main" component={MainPanchang}/>
      <Stack.Screen name="MainList" component={PanchangList}/>
      <Stack.Screen
        name="remedyBookingDetails"
        component={RemedyBookingDetails}
      />
      <Stack.Screen
        name="remedyHistoryDetails"
        component={RemedyHistoryDetails}
      />
      <Stack.Group>
        <Stack.Screen name="eCommerce" component={ECommerce} />
        <Stack.Screen
          name="eCommerceSubCategory"
          component={EcommerceSubCategory}
        />
        <Stack.Screen name="poojaAstrologer" component={PoojaAstrologer} />
        <Stack.Screen name="poojaDetails" component={PoojaDetails} />
        <Stack.Screen name="poojaPayement" component={PoojaPayement} />
        <Stack.Screen name="productDetailes" component={ProductDetailes} />
        <Stack.Screen name="cart" component={Cart} />
        <Stack.Screen name="poojaAstroUploads" component={PoojaAstroUploads} />
        <Stack.Screen name="personalDetailes" component={PersonalDetailes} />
        <Stack.Screen name="bookPooja" component={BookPooja} />
        <Stack.Screen name="products" component={Products} />
        <Stack.Screen name="productTracking" component={ProductTracking} />
        <Stack.Screen name= "MatchingKundliList" component={MatchingKundliList} />
        <Stack.Screen
          name="productSuccessBooking"
          component={ProductSuccessBooking}
        />
        <Stack.Screen
          name="productHistoryDetails"
          component={ProductHistoryDetails}
        />
        <Stack.Screen
          name="poojaHistoryDetailes"
          component={PoojaHistoryDetailes}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="courses" component={Courses} />
        <Stack.Screen name="myCourses" component={MyCourses} />
        <Stack.Screen name="demoClass" component={DemoClass} />
        <Stack.Screen name="classLive" component={ClassLive} />
        <Stack.Screen name="tarotTeachers" component={TarotTeachers} />
        <Stack.Screen name="teacherDetails" component={TeacherDetails} />
        <Stack.Screen name="demoClassOverview" component={DemoClassOverview} />
        <Stack.Screen name="demoClassDetails" component={DemoClassDetails} />
        <Stack.Screen name="freePdf" component={FreePdf} />
        <Stack.Screen name="scheduleCourse" component={ScheduleCourse} />
        <Stack.Screen name="paidPdf" component={PaidPdf} />
        <Stack.Screen name="paidPdfDetails" component={PaidPdfDetails} />
        <Stack.Screen
          name="courseBookingDetails"
          component={CourseBookingDetails}
        />
        <Stack.Screen name="liveClasses" component={LiveClasses} />
        <Stack.Screen name="liveNow" component={LiveNow} />
      </Stack.Group>
      <Stack.Screen name="searchAstrologers" component={SearchAstrologers} />
      <Stack.Screen
        options={{headerShown: false}}
        name="audiencePage"
        component={AudiencePage}
      />
      <Stack.Screen name="floatingHeart" component={FloatingHeart} />
      <Stack.Screen name="youTubeShorts" component={YouTubeShorts} />
      <Stack.Screen name="privacy" component={Privacy} />
      <Stack.Screen name="terms" component={Terms} />
      <Stack.Screen
        name="tesetimonialsDetails"
        component={TesetimonialsDetails}
      />
      <Stack.Screen name="onlineAstrologers" component={OnlineAstrologers} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
