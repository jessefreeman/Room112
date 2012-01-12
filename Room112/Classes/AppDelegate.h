//
//  AppDelegate.h
//  Room112
//
//  Created by Jesse Freeman on 1/12/12.
//  Copyright Roundarch 2012. All rights reserved.
//

#import <UIKit/UIKit.h>
#ifdef PHONEGAP_FRAMEWORK
	#import <PhoneGap/PhoneGapDelegate.h>
#else
	#import "PhoneGapDelegate.h"
#endif

@interface AppDelegate : PhoneGapDelegate {

	NSString* invokeString;
}

// invoke string is passed to your app on launch, this is only valid if you 
// edit Room112.plist to add a protocol
// a simple tutorial can be found here : 
// http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html

@property (copy)  NSString* invokeString;

@end

