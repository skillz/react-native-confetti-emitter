package com.skillz.rnconfettiview

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ReactConfettiViewManager extends ViewGroupManager<ReactConfettiView> {

    public static final String REACT_CLASS = "ConfettiView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactConfettiView createViewInstance(ThemedReactContext context) {
        return new ReactConfettiView(context);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @ReactProp(name = "positionOfEmission", customType = "object")
    public void setPosition(ReactConfettiView view, ReadableMap position) {
        view.setPosition(position);
    }

    @ReactProp(name = "colors", customType = "object")
    public void setColors(ReactConfettiView view, ReadableArray colors) {
        view.setColors(colors);
    }

    @ReactProp(name = "direction", customType = "object")
    public void setDirection(ReactConfettiView view, ReadableMap direction) {
        view.setDirection(direction);
    }

    @ReactProp(name = "confettiSpeed", customType = "object")
    public void setSpeed(ReactConfettiView view, ReadableMap confettiSpeed) {
        view.setSpeed(confettiSpeed);
    }

    @ReactProp(name = "fadeOutEnabled", defaultBoolean = false)
    public void setFadeOutEnabled(ReactConfettiView view, boolean fadeOut) {
        view.setFadeOutEnabled(fadeOut);
    }

    @ReactProp(name = "setTimeToLive", defaultInt = 2500)
    public void setTimeToLive(ReactConfettiView view, int timeToLive) {
        view.setTimeToLive(timeToLive);
    }

    @ReactProp(name = "sizeMass", customType = "object")
    public void setSizeMass(ReactConfettiView view, ReadableMap sizeMass) {
        view.setSizeMass(sizeMass);
    }

    @ReactProp(name = "numParticlesPerSec", defaultInt = 300)
    public void setNumParticlesPerSec(ReactConfettiView view, int numParticles) {
        view.setNumParticlesPerSec(numParticles);
    }

    @ReactProp(name = "duration", defaultInt = 5000)
    public void setDuration(ReactConfettiView view, int duration) {
        view.setDuration(duration);
    }

    @ReactProp(name = "burst", defaultBoolean = false)
    public void setBurstView(ReactConfettiView view, boolean isBurstView) {
        if (isBurstView) {
            view.buildBurst();
        }
    }
}
