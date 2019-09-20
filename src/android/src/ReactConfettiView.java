package com.skillz.rnconfettiview

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import nl.dionsegijn.konfetti.KonfettiView;
import nl.dionsegijn.konfetti.ParticleSystem;
import nl.dionsegijn.konfetti.models.Shape;
import nl.dionsegijn.konfetti.models.Size;

public class ReactConfettiView extends ReactViewGroup {

    private boolean burst = false;
    private List<Integer> confettiColors = Arrays.asList(Color.YELLOW, Color.GREEN, Color.MAGENTA);
    private long confettiDuration = 3000l;
    private boolean confettiFadeOut = false;
    private ParticleSystem confettiParticleSystem;
    private float confettiPositionMinX = -50f;
    private float confettiPositionMaxX = Resources.getSystem().getDisplayMetrics().widthPixels + 50;
    private float confettiPositionMinY = -50f;
    private float confettiPositionMaxY = 0;
    private long confettiTimeToLive = 2500l;
    private Size confettiSize = new Size(3,5);
    private int directionStart = 0;
    private int directionEnd = 359;
    private KonfettiView konfettiView;
    private Context mContext;
    private int numConfettiPerSec = 300;
    private float speedMin = 1f;
    private float speedMax = 5f;

    public ReactConfettiView(ThemedReactContext context) {
        super(context);
        this.mContext = context;

        this.konfettiView = new KonfettiView(context);
        this.setLayoutParams(new ViewGroup.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        this.setEnabled(false);
        this.konfettiView.setEnabled(false);
    }

    public void requestLayoutInside(View view) {
        view.requestLayout();
        post(measureAndLayout(view));
    }

    private final Runnable measureAndLayout(View view) {
        return new Runnable() {
            @Override
            public void run() {
                view.measure(
                        MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                view.layout(getLeft(), getTop(), getRight(), getBottom());
            }
        };
    }

    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {
        if (this.konfettiView.getParent() == null) {
            this.addView(this.konfettiView, 0, this.getLayoutParams());
            this.requestLayoutInside(this.konfettiView);
        }

    }

    public void konfettiViewBuilder() {
        this.konfettiView = null;
        this.konfettiView = new KonfettiView(this.mContext);
        konfettiView.setEnabled(false);
        this.confettiParticleSystem = this.konfettiView.build()
                .addColors(this.confettiColors)
                .setDirection(this.directionStart, this.directionEnd)
                .setSpeed(this.speedMin, this.speedMax)
                .setFadeOutEnabled(this.confettiFadeOut)
                .setTimeToLive(this.confettiTimeToLive)
                .addShapes(Shape.RECT, Shape.CIRCLE)
                .addSizes(this.confettiSize)
                .setPosition(this.confettiPositionMinX, this.confettiPositionMaxX, this.confettiPositionMinY, this.confettiPositionMaxY);
        if (this.burst) {
            this.confettiParticleSystem.burst(this.numConfettiPerSec);
        } else {
            this.confettiParticleSystem.streamFor(this.numConfettiPerSec, this.confettiDuration);
        }
    }

    public static List<Integer> hexColorReadableArrayToColorIntList(ReadableArray readableArray) {
        List<Integer> list = new ArrayList<>();

        for (int i = 0; i < readableArray.size(); i++) {
            int colorIntForHexColor = Color.parseColor(readableArray.getString(i));
            list.add(colorIntForHexColor);
        }
        return list;
    }

    public void setPosition(ReadableMap position) {
        this.confettiPositionMinX = (float)position.getDouble("minX");
        this.confettiPositionMaxX = (float)position.getDouble("maxX");
        this.confettiPositionMinY = (float)position.getDouble("minY");
        this.confettiPositionMaxY = (float)position.getDouble("maxY");
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setColors(ReadableArray colors) {
        this.confettiColors = hexColorReadableArrayToColorIntList(colors);
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setDirection(ReadableMap direction) {
        this.directionStart = direction.getInt("start");
        this.directionEnd = direction.getInt("end");
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setSpeed(ReadableMap confettiSpeed) {
        this.speedMin = (float)confettiSpeed.getInt("min");
        this.speedMax = (float)confettiSpeed.getInt("max");
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setFadeOutEnabled(boolean fadeOut) {
        this.confettiFadeOut = fadeOut;
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setTimeToLive(int timeToLive) {
        this.confettiTimeToLive = (long)timeToLive;
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setSizeMass(ReadableMap sizeMass) {
        this.confettiSize = new Size(sizeMass.getInt("size"), sizeMass.getInt("mass"));
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setNumParticlesPerSec(int numParticles) {
        this.numConfettiPerSec = numParticles;
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void setDuration(int duration) {
        this.confettiDuration = (long)duration;
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }

    public void buildBurst() {
        this.burst = true;
        this.konfettiView.reset();
        for (ParticleSystem paSystem : this.konfettiView.getActiveSystems()) {
            this.konfettiView.stop(paSystem);
        }
        this.konfettiViewBuilder();
    }
}
