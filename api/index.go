package handler

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"
)

//go:embed pools.json
var poolsJSON []byte

type AssetPools struct {
	Wizard []string `json:"wizard"`
	Left   []string `json:"left"`
	Right  []string `json:"right"`
}

var pools AssetPools

func init() {
	_ = json.Unmarshal(poolsJSON, &pools)
	rand.Seed(time.Now().UnixNano())
}

type RedisResponse struct {
	Result int64 `json:"result"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	side := query.Get("side")
	reqType := query.Get("type")

	var selectedURL string

	if reqType == "wizard" || side == "wizard" {
		wizardPool := pools.Wizard
		if len(wizardPool) == 0 {
			http.Error(w, "Wizard pool empty", http.StatusInternalServerError)
			return
		}

		wizardIndex := -1
		redisURL := os.Getenv("UPSTASH_REDIS_REST_URL")
		redisToken := os.Getenv("UPSTASH_REDIS_REST_TOKEN")

		// 1. Try Upstash Redis Atomic Increment via REST API
		if redisURL != "" && redisToken != "" {
			reqURL := fmt.Sprintf("%s/incr/wizard_counter", redisURL)
			req, err := http.NewRequest("GET", reqURL, nil)
			if err == nil {
				req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", redisToken))
				client := &http.Client{Timeout: 1500 * time.Millisecond}
				resp, err := client.Do(req)
				if err == nil && resp.StatusCode == 200 {
					body, err := io.ReadAll(resp.Body)
					resp.Body.Close()
					if err == nil {
						var rData RedisResponse
						if err := json.Unmarshal(body, &rData); err == nil {
							val := rData.Result
							if val < 0 {
								val = -val
							}
							wizardIndex = int(val % int64(len(wizardPool)))
						}
					}
				}
			}
		}

		// 2. Graceful Fallback: 7-second time-epoch rotation
		if wizardIndex < 0 {
			epochSec := time.Now().Unix()
			wizardIndex = int((epochSec / 7) % int64(len(wizardPool)))
		}

		selectedURL = wizardPool[wizardIndex]
	} else {
		// Synchronized Anime Duels Pairing
		var pool []string
		if side == "right" {
			pool = pools.Right
		} else {
			pool = pools.Left
		}

		if len(pool) == 0 {
			http.Error(w, "Pool empty", http.StatusInternalServerError)
			return
		}

		// Synchronize left & right using 7-second time-epoch pairing
		epochSec := time.Now().Unix()
		pairIndex := int((epochSec / 7) % int64(len(pool)))
		selectedURL = pool[pairIndex]
	}

	// Fetch binary GIF asset from GitHub raw CDN
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(selectedURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		http.Error(w, "Error serving GIF asset", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	gifData, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Error reading GIF asset", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "image/gif")
	w.Header().Set("Content-Length", strconv.Itoa(len(gifData)))
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.Header().Set("CDN-Cache-Control", "no-store")
	w.Header().Set("Surrogate-Control", "no-store")

	w.WriteHeader(http.StatusOK)
	w.Write(gifData)
}
